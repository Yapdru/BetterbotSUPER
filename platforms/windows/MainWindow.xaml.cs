using System.Diagnostics;
using System.IO;
using System.Windows;
using Microsoft.Web.WebView2.Core;
namespace BetterBot;
public partial class MainWindow : Window {
    public MainWindow() { InitializeComponent(); }
    private async void WindowLoaded(object sender, RoutedEventArgs e) {
        try {
            var profile=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"BetterBot","WebView");
            var environment=await CoreWebView2Environment.CreateAsync(null,profile);
            await Browser.EnsureCoreWebView2Async(environment);
            Browser.CoreWebView2.Settings.AreHostObjectsAllowed=false;
            Browser.CoreWebView2.Settings.IsWebMessageEnabled=false;
            Browser.CoreWebView2.SetVirtualHostNameToFolderMapping("betterbot.local",Path.Combine(AppContext.BaseDirectory,"Web"),CoreWebView2HostResourceAccessKind.DenyCors);
            Browser.CoreWebView2.NavigationStarting+=(_,args)=>{
                if(Uri.TryCreate(args.Uri,UriKind.Absolute,out var uri) && uri.Scheme=="https" && uri.Host=="betterbot.local") return;
                args.Cancel=true;
                if(args.IsUserInitiated) OpenExternal(args.Uri);
            };
            Browser.CoreWebView2.NewWindowRequested+=(_,args)=>{args.Handled=true;if(args.IsUserInitiated) OpenExternal(args.Uri);};
            Browser.Source=new Uri("https://betterbot.local/index.html");
        } catch(Exception) { MessageBox.Show("BetterBot could not start. Check that Microsoft Edge WebView2 Runtime and the bundled Web folder are installed.","BetterBot"); }
    }
    private static void OpenExternal(string value) {
        if(!Uri.TryCreate(value,UriKind.Absolute,out var uri) || (uri.Scheme!="https" && uri.Scheme!="mailto")) return;
        try { Process.Start(new ProcessStartInfo(uri.AbsoluteUri) { UseShellExecute=true }); } catch { MessageBox.Show("Could not open the browser."); }
    }
    private void OpenOnline(object sender,RoutedEventArgs e)=>OpenExternal("https://betterai-3ca66.web.app");
}
