"use client";
import { useEffect, useState } from "react";
import { subscribeToPush, unsubscribeFromPush } from "./push-actions";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData, (c) => c.charCodeAt(0));
}

// FR-6.5-adjacent: solves "people don't know how to install a PWA" by putting
// the instructions directly in the app rather than assuming discoverability.
function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (isStandalone) return null;

  return (
    <div className="relative border border-dashed border-neutral-300 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between">
      {/* Corner Handles */}
      <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border border-neutral-400 bg-white z-20"></div>
      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 border border-neutral-400 bg-white z-20"></div>
      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border border-neutral-400 bg-white z-20"></div>
      <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border border-neutral-400 bg-white z-20"></div>

      <div>
        <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">App Access</span>
        <h3 className="text-xs font-semibold text-neutral-800 mt-1">Install PipeLine for quick access</h3>
        {isIOS ? (
          <p className="text-[11px] text-neutral-500 mt-1 leading-normal">
            Tap the Share button in Safari, then choose &quot;Add to Home Screen&quot;.
          </p>
        ) : (
          <p className="text-[11px] text-neutral-500 mt-1 leading-normal">
            Open your browser menu and choose &quot;Install app&quot; or &quot;Add to Home Screen&quot;.
          </p>
        )}
      </div>
    </div>
  );
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const timer = setTimeout(() => {
        setIsSupported(true);
      }, 0);
      
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).then(async (registration) => {
        const sub = await registration.pushManager.getSubscription();
        setSubscription(sub);
      });
      
      return () => clearTimeout(timer);
    }
  }, []);

  async function subscribe() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!) as BufferSource,
    });
    setSubscription(sub);
    await subscribeToPush(JSON.parse(JSON.stringify(sub)));
  }

  async function unsubscribe() {
    if (!subscription) return;
    await subscription.unsubscribe();
    await unsubscribeFromPush(subscription.endpoint);
    setSubscription(null);
  }

  if (!isSupported) return null;

  return (
    <div className="relative border border-dashed border-neutral-300 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col justify-between">
      {/* Corner Handles */}
      <div className="absolute -top-1 -left-1 w-1.5 h-1.5 border border-neutral-400 bg-white z-20"></div>
      <div className="absolute -top-1 -right-1 w-1.5 h-1.5 border border-neutral-400 bg-white z-20"></div>
      <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 border border-neutral-400 bg-white z-20"></div>
      <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 border border-neutral-400 bg-white z-20"></div>

      {subscription ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
          <div>
            <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">Device Alerts</span>
            <p className="text-xs font-semibold text-neutral-800 mt-1">Notifications are active on this device</p>
            <p className="text-[11px] text-neutral-500 mt-0.5">We will alert you instantly for new emergency bookings.</p>
          </div>
          <button
            onClick={unsubscribe}
            className="border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-red-600 text-[10px] font-bold uppercase py-1.5 px-3 tracking-wider rounded-none shrink-0 self-start sm:self-center transition-colors"
          >
            Turn off
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
          <div>
            <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">Device Alerts</span>
            <p className="text-xs font-semibold text-neutral-800 mt-1">Get instant emergency alerts</p>
            <p className="text-[11px] text-neutral-500 mt-0.5 font-normal">We can notify you directly for urgent bookings.</p>
          </div>
          <button
            onClick={subscribe}
            className="border border-neutral-300 bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-bold uppercase py-1.5 px-3 tracking-wider rounded-none shrink-0 self-start sm:self-center transition-colors"
          >
            Enable
          </button>
        </div>
      )}
    </div>
  );
}

export default function PushAndInstallBanner() {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const showInstall = !isStandalone;

  return (
    <div className={`grid grid-cols-1 ${showInstall ? "md:grid-cols-2" : "grid-cols-1"} gap-4 w-full mb-8 z-10`}>
      <InstallPrompt />
      <PushNotificationManager />
    </div>
  );
}
