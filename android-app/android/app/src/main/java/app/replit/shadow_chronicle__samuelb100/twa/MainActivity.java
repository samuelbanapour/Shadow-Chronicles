package app.replit.shadow_chronicle__samuelb100.twa;

import android.os.Bundle;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

public class MainActivity extends BridgeActivity {

    /**
     * Initializes the Google Mobile Ads SDK and shows a banner.
     *
     * The game is loaded remotely (shadow-chronicles-1.onrender.com), so we drive the
     * AdMob plugin from the native side by evaluating JS in the page after it loads.
     * The script waits for the Capacitor AdMob bridge, then shows an adaptive banner
     * pinned to the bottom of the screen. A window flag keeps it from running twice.
     *
     * Uses Google's OFFICIAL TEST banner unit (ca-app-pub-3940256099942544/6300978111).
     * Replace it with your real banner ad-unit ID before publishing for real revenue.
     */
    private static final String ADMOB_BOOTSTRAP_JS =
        "(function(){" +
        "  if (window.__scAdmobStarted) { return; }" +
        "  window.__scAdmobStarted = true;" +
        "  var tries = 0;" +
        "  function start(){" +
        "    var C = window.Capacitor;" +
        "    if (!C || !C.Plugins || !C.Plugins.AdMob) {" +
        "      if (tries++ < 60) { return setTimeout(start, 500); }" +
        "      return;" +
        "    }" +
        "    var AdMob = C.Plugins.AdMob;" +
        "    AdMob.initialize({ initializeForTesting: true })" +
        "      .then(function(){" +
        "        return AdMob.showBanner({" +
        "          adId: 'ca-app-pub-3940256099942544/6300978111'," +
        "          adSize: 'ADAPTIVE_BANNER'," +
        "          position: 'BOTTOM_CENTER'," +
        "          margin: 0," +
        "          isTesting: true" +
        "        });" +
        "      })" +
        "      .catch(function(e){" +
        "        window.__scAdmobStarted = false;" +
        "        console.log('[AdMob] banner failed: ' + (e && e.message ? e.message : e));" +
        "      });" +
        "  }" +
        "  start();" +
        "})();";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Re-inject after each page load so the banner survives reloads.
        this.getBridge().setWebViewClient(new BridgeWebViewClient(this.getBridge()) {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                view.evaluateJavascript(ADMOB_BOOTSTRAP_JS, null);
            }
        });
    }
}
