import { useEffect, useRef, useState } from "react";

const DEFAULT_BUILD_URL = import.meta.env.VITE_UNITY_BUILD_URL || "/unity/Build";
const LOADER_FILE = import.meta.env.VITE_UNITY_LOADER_FILE || "freshman-exam.loader.js";

export default function UnityWebGLPlayer({
  buildUrl = DEFAULT_BUILD_URL,
  className = "hidden h-0 w-0 overflow-hidden",
}) {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    let cancelled = false;
    const script = document.createElement("script");
    script.src = `${buildUrl}/${LOADER_FILE}`;
    script.async = true;

    script.onload = async () => {
      if (cancelled || typeof window.createUnityInstance !== "function") {
        setStatus("missing-loader");
        return;
      }

      try {
        const instance = await window.createUnityInstance(canvas, {
          dataUrl: `${buildUrl}/freshman-exam.data`,
          frameworkUrl: `${buildUrl}/freshman-exam.framework.js`,
          codeUrl: `${buildUrl}/freshman-exam.wasm`,
        });

        if (cancelled) {
          instance.Quit?.();
          return;
        }

        window.unityInstance = instance;
        setStatus("ready");
      } catch (error) {
        console.warn("Unity WebGL build is not available yet:", error.message);
        setStatus("unavailable");
      }
    };

    script.onerror = () => {
      if (!cancelled) {
        setStatus("unavailable");
      }
    };

    document.body.appendChild(script);

    return () => {
      cancelled = true;
      script.remove();
      if (window.unityInstance?.Quit) {
        window.unityInstance.Quit();
      }
      window.unityInstance = undefined;
    };
  }, [buildUrl]);

  return (
    <div className={className} data-unity-status={status} aria-hidden="true">
      <canvas ref={canvasRef} id="unity-canvas" />
    </div>
  );
}
