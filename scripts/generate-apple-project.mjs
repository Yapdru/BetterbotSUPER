import {mkdir, readFile, writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const apple=path.join(root,'platforms/apple');
const directory=path.join(apple,'BetterBotApple.xcodeproj');
await mkdir(path.join(directory,'xcshareddata/xcschemes'),{recursive:true});
const decode=s=>s.replace(/<[^>]*>/g,'').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Number(n)));
let libraryFile=path.join(root,'knowledge/generated/library.json');
try{await readFile(libraryFile);}catch{libraryFile=path.join(root,'knowledge/pilot.json');}
const pilot=JSON.parse(await readFile(libraryFile,'utf8'));
await writeFile(path.join(apple,'Shared/native-library.json'),JSON.stringify(pilot.entries.map(e=>({
  id:e.id,title:decode(e.title),question:decode(e.question.html),answer:decode(e.answer.html),
  author:decode(e.answer.author.display_name),license:e.answer.license,url:e.answer.url,
  questionAuthor:decode(e.question.author.display_name),questionLicense:e.question.license,questionURL:e.question.url
})),null,2));
const objects=[];let counter=0;
const next=()=> (++counter).toString(16).toUpperCase().padStart(24,'0');
const q=s=>JSON.stringify(String(s));
const add=(isa,fields,id=next())=>{objects.push(`${id} = { isa = ${isa}; ${fields} };`);return id;};
const list=a=>`(${a.join(',')}${a.length?',':''})`;
const setting=obj=>`{ ${Object.entries(obj).map(([k,v])=>`${q(k)} = ${q(v)};`).join(' ')} }`;
const refs=new Map();const files=[];
function ref(file,type){if(refs.has(file))return refs.get(file);const id=add('PBXFileReference',`lastKnownFileType = ${q(type)}; path = ${q(file)}; sourceTree = "<group>";`);refs.set(file,id);files.push(id);return id;}
function phase(isa,items,extra='') {return add(isa,`buildActionMask = 2147483647; files = ${list(items)}; runOnlyForDeploymentPostprocessing = 0; ${extra}`);}
const projectID=next(), groupID=next(), productsID=next();
const common=['Shared/FocusSession.swift','Shared/LibraryView.swift','Shared/NativeToolsView.swift'];
const content='BetterBot/BetterBot/ContentView.swift';
const targets=[
 {name:'BetterBotLiveActivity',bundle:'com.yapdru.betterbot.liveactivity',extension:true,sdk:'iphoneos',platforms:'iphoneos iphonesimulator',family:'1,2',sources:['Shared/FocusAttributes.swift','LiveActivity/FocusWidget.swift'],extra:{INFOPLIST_FILE:'LiveActivity/Info.plist',SKIP_INSTALL:'YES',APPLICATION_EXTENSION_API_ONLY:'YES'}},
 {name:'BetterBot',bundle:'com.yapdru.betterbot',sdk:'iphoneos',platforms:'iphoneos iphonesimulator',family:'1,2',sources:['BetterBot/BetterBot/MyApp.swift',content,...common,'Shared/FocusAttributes.swift','Shared/HomeView.swift','Shared/DrivingMapView.swift','CarPlay/CarPlayMapScene.swift','Shared/GuidancePill.swift'],web:true,embed:true,extra:{CODE_SIGN_ENTITLEMENTS:'Shared/BetterBot.entitlements',INFOPLIST_KEY_NSLocationWhenInUseUsageDescription:'Show your location and approximate GPS speed only while you use the driving map.',INFOPLIST_KEY_NSHomeKitUsageDescription:'View your rooms and run scenes only when you choose to connect Apple Home.',INFOPLIST_KEY_NSSupportsLiveActivities:'YES'}},
 {name:'BetterBotWatch',bundle:'com.yapdru.betterbot.watch',sdk:'watchos',platforms:'watchos watchsimulator',family:'4',sources:['Watch/WatchApp.swift',...common],extra:{INFOPLIST_KEY_WKApplication:'YES',INFOPLIST_KEY_WKWatchOnly:'YES',INFOPLIST_KEY_WKRunsIndependentlyOfCompanionApp:'YES'}},
 {name:'BetterBotTV',bundle:'com.yapdru.betterbot.tv',sdk:'appletvos',platforms:'appletvos appletvsimulator',family:'3',sources:['TV/TVApp.swift',...common]},
 {name:'BetterBotVision',bundle:'com.yapdru.betterbot.vision',sdk:'xros',platforms:'xros xrsimulator',family:'7',sources:['Vision/VisionApp.swift',content,...common],web:true},
 {name:'BetterBotMac',bundle:'com.yapdru.betterbot.mac',sdk:'macosx',platforms:'macosx',family:'',sources:['BetterBot/BetterBot/MyApp.swift',content,...common],web:true,extra:{ENABLE_APP_SANDBOX:'YES',ENABLE_OUTGOING_NETWORK_CONNECTIONS:'YES'}}
];
const productRefs=[];const nativeTargets=[];
for(const t of targets){
 t.id=next();t.product=add('PBXFileReference',`explicitFileType = ${t.extension?'"wrapper.app-extension"':'"wrapper.application"'}; includeInIndex = 0; path = ${q(t.name+(t.extension?'.appex':'.app'))}; sourceTree = BUILT_PRODUCTS_DIR;`);productRefs.push(t.product);
}
for(const t of targets){
 const sourceBuilds=t.sources.map(file=>add('PBXBuildFile',`fileRef = ${ref(file,'sourcecode.swift')};`));
 const resources=[];
 if(!t.extension) resources.push(add('PBXBuildFile',`fileRef = ${ref('Shared/native-library.json','text.json')};`));
 if(t.web) resources.push(add('PBXBuildFile',`fileRef = ${ref('BetterBot/BetterBot/Web.bundle','wrapper.plug-in')};`));
 const phases=[phase('PBXSourcesBuildPhase',sourceBuilds),phase('PBXFrameworksBuildPhase',[]),phase('PBXResourcesBuildPhase',resources)];const dependencies=[];
 if(t.embed){const widget=targets[0];const build=add('PBXBuildFile',`fileRef = ${widget.product}; settings = { ATTRIBUTES = (RemoveHeadersOnCopy,); };`);
 phases.push(phase('PBXCopyFilesBuildPhase',[build],'dstPath = ""; dstSubfolderSpec = 13; name = "Embed Live Activity";'));
 const proxy=add('PBXContainerItemProxy',`containerPortal = ${projectID}; proxyType = 1; remoteGlobalIDString = ${widget.id}; remoteInfo = ${q(widget.name)};`);
 dependencies.push(add('PBXTargetDependency',`target = ${widget.id}; targetProxy = ${proxy};`));}
 const configs=['Debug','Release'].map(name=>add('XCBuildConfiguration',`name = ${name}; buildSettings = ${setting({
 PRODUCT_NAME:'$(TARGET_NAME)',PRODUCT_BUNDLE_IDENTIFIER:t.bundle,SWIFT_VERSION:'5.0',SWIFT_STRICT_CONCURRENCY:'targeted',
 SDKROOT:t.sdk,SUPPORTED_PLATFORMS:t.platforms,TARGETED_DEVICE_FAMILY:t.family,
 GENERATE_INFOPLIST_FILE:t.extension?'NO':'YES',INFOPLIST_KEY_CFBundleDisplayName:'BetterBot',
 INFOPLIST_KEY_UIApplicationSceneManifest_Generation:'YES',INFOPLIST_KEY_UILaunchScreen_Generation:'YES',
 CURRENT_PROJECT_VERSION:'2',MARKETING_VERSION:'1.1',CODE_SIGN_STYLE:'Automatic',
 LD_RUNPATH_SEARCH_PATHS:'$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks',
 IPHONEOS_DEPLOYMENT_TARGET:'18.0',WATCHOS_DEPLOYMENT_TARGET:'11.0',TVOS_DEPLOYMENT_TARGET:'18.0',XROS_DEPLOYMENT_TARGET:'2.0',MACOSX_DEPLOYMENT_TARGET:'15.0',
 SWIFT_OPTIMIZATION_LEVEL:name==='Debug'?'-Onone':'-O',SWIFT_ACTIVE_COMPILATION_CONDITIONS:name==='Debug'?'DEBUG':'',
 ...t.extra
 })};`));
 const configList=add('XCConfigurationList',`buildConfigurations = ${list(configs)}; defaultConfigurationIsVisible = 0; defaultConfigurationName = Release;`);
 add('PBXNativeTarget',`buildConfigurationList = ${configList}; buildPhases = ${list(phases)}; buildRules = (); dependencies = ${list(dependencies)}; name = ${q(t.name)}; productName = ${q(t.name)}; productReference = ${t.product}; productType = ${q(t.extension?'com.apple.product-type.app-extension':'com.apple.product-type.application')};`,t.id);nativeTargets.push(t.id);
 const entry=`<BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="${t.id}" BuildableName="${t.name}${t.extension?'.appex':'.app'}" BlueprintName="${t.name}" ReferencedContainer="container:BetterBotApple.xcodeproj"/>`;
 await writeFile(path.join(directory,`xcshareddata/xcschemes/${t.name}.xcscheme`),`<?xml version="1.0" encoding="UTF-8"?><Scheme LastUpgradeVersion="2700" version="1.3"><BuildAction parallelizeBuildables="YES" buildImplicitDependencies="YES"><BuildActionEntries><BuildActionEntry buildForTesting="YES" buildForRunning="YES" buildForProfiling="YES" buildForArchiving="YES" buildForAnalyzing="YES">${entry}</BuildActionEntry></BuildActionEntries></BuildAction><LaunchAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" launchStyle="0" useCustomWorkingDirectory="NO" ignoresPersistentStateOnLaunch="NO" debugDocumentVersioning="YES" debugServiceExtension="internal" allowLocationSimulation="YES"><BuildableProductRunnable runnableDebuggingMode="0">${entry}</BuildableProductRunnable></LaunchAction><ProfileAction buildConfiguration="Release" shouldUseLaunchSchemeArgsEnv="YES" savedToolIdentifier="" useCustomWorkingDirectory="NO" debugDocumentVersioning="YES"><BuildableProductRunnable runnableDebuggingMode="0">${entry}</BuildableProductRunnable></ProfileAction><AnalyzeAction buildConfiguration="Debug"/><ArchiveAction buildConfiguration="Release" revealArchiveInOrganizer="YES"/></Scheme>`);
}
add('PBXGroup',`children = ${list([...files,productsID])}; sourceTree = "<group>";`,groupID);
add('PBXGroup',`children = ${list(productRefs)}; name = Products; sourceTree = "<group>";`,productsID);
const configs=['Debug','Release'].map(name=>add('XCBuildConfiguration',`name = ${name}; buildSettings = ${setting({CLANG_ENABLE_MODULES:'YES',ENABLE_USER_SCRIPT_SANDBOXING:'YES',ONLY_ACTIVE_ARCH:name==='Debug'?'YES':'NO',DEBUG_INFORMATION_FORMAT:name==='Debug'?'dwarf':'dwarf-with-dsym'})};`));
const configList=add('XCConfigurationList',`buildConfigurations = ${list(configs)}; defaultConfigurationIsVisible = 0; defaultConfigurationName = Release;`);
add('PBXProject',`attributes = { LastUpgradeCheck = 2700; }; buildConfigurationList = ${configList}; compatibilityVersion = "Xcode 14.0"; developmentRegion = en; hasScannedForEncodings = 0; knownRegions = (en,Base,); mainGroup = ${groupID}; productRefGroup = ${productsID}; projectDirPath = ""; projectRoot = ""; targets = ${list(nativeTargets)};`,projectID);
await writeFile(path.join(directory,'project.pbxproj'),`// !$*UTF8*$!\n{ archiveVersion = 1; classes = {}; objectVersion = 56; objects = {\n${objects.join('\n')}\n}; rootObject = ${projectID}; }\n`);
console.log('Generated Apple suite: '+targets.map(t=>t.name).join(', '));
