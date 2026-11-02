"""Download a bounded, attributed public coding Q&A pilot. No server writes."""
import json
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

BASE = 'https://api.stackexchange.com/2.3/'

def get(path, **parameters):
    parameters.update(site='stackoverflow', filter='withbody', pagesize=20)
    request = urllib.request.Request(BASE + path + '?' + urllib.parse.urlencode(parameters), headers={'User-Agent':'BetterBot-Knowledge-Pilot/1.0'})
    with urllib.request.urlopen(request, timeout=30) as response:
        data = json.load(response)
    if data.get('error_id') or data.get('backoff'):
        raise RuntimeError('API requested a stop/backoff; no retry performed.')
    return data['items']

def main():
    questions = get('search/advanced', tagged='python', accepted='true', sort='votes', order='desc')
    ids = [str(q['accepted_answer_id']) for q in questions if q.get('accepted_answer_id')]
    if not ids:
        raise RuntimeError('No accepted answers returned.')
    answers = {a['answer_id']:a for a in get('answers/' + ';'.join(ids))}
    entries = []
    for q in questions:
        a = answers.get(q.get('accepted_answer_id'))
        if not a or not q.get('content_license') or not a.get('content_license'):
            continue
        entries.append({
            'id': 'stackoverflow:' + str(q['question_id']),
            'title': q['title'], 'tags':q['tags'],
            'question': {'html':q['body'], 'url':q['link'], 'author':q.get('owner',{}), 'license':q['content_license']},
            'answer': {'html':a['body'], 'url':'https://stackoverflow.com/a/' + str(a['answer_id']), 'author':a.get('owner',{}), 'license':a['content_license']},
            'source':'Stack Overflow', 'retrievedAt':datetime.now(timezone.utc).isoformat(),
        })
    if not entries:
        raise RuntimeError('No records with complete attribution and licenses.')
    payload = json.dumps({'version':1,'entries':entries}, ensure_ascii=False)
    if len(payload.encode()) > 2_000_000:
        raise RuntimeError('Pilot exceeds its 2 MB local cap.')
    output = Path(__file__).with_name('pilot.json')
    output.write_text(payload, encoding='utf-8')
    print(json.dumps({'records':len(entries),'bytes':len(payload.encode()),'file':str(output),'serverWrites':0}))

if __name__ == '__main__':
    main()
