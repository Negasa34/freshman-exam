const UNITY_OBJECT = "AgentObject";
const UNITY_METHOD = "ReceiveResponse";
const UNITY_ACTION_METHOD = "ReceiveAction";

export function sendReplyToUnityAgent(reply, action) {
  const unityInstance = window.unityInstance;

  if (typeof unityInstance?.SendMessage !== "function") {
    return false;
  }

  try {
    unityInstance.SendMessage(UNITY_OBJECT, UNITY_METHOD, reply);
    if (typeof action === "string" && action.trim()) {
      unityInstance.SendMessage(UNITY_OBJECT, UNITY_ACTION_METHOD, action);
    }
    return true;
  } catch (error) {
    console.error("Could not send the AI response to the Unity agent:", error);
    return false;
  }
}
