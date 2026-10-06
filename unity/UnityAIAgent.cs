using System.Collections;
using UnityEngine;

/// <summary>
/// Attach this script to a GameObject named <c>AgentObject</c>.
/// The React client calls:
/// <c>window.unityInstance.SendMessage("AgentObject", "ReceiveResponse", reply)</c>
/// </summary>
public sealed class UnityAIAgent : MonoBehaviour
{
    [SerializeField] private Animator animator;
    [SerializeField] private string talkTrigger = "Talk";
    [SerializeField] private string talkingBool = "IsTalking";
    [SerializeField] private string actionParam = "Action";
    [SerializeField] private float talkDurationSeconds = 2.5f;

    private Coroutine stopTalkingCoroutine;

    private void Awake()
    {
        if (animator == null)
        {
            animator = GetComponent<Animator>();
        }
    }

    /// <summary>
    /// Entry point used by Unity WebGL <c>SendMessage</c> from the React portal.
    /// </summary>
    public void ReceiveResponse(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            Debug.LogWarning("Unity AI received an empty response.", this);
            return;
        }

        Debug.Log($"Unity AI response: {text}", this);
        ApplyTalkState();
    }

    /// <summary>
    /// Optional second channel if the frontend also sends <c>data.action</c>
    /// (talk, idle, celebrate) as its own SendMessage call.
    /// </summary>
    public void ReceiveAction(string action)
    {
        if (animator == null || string.IsNullOrWhiteSpace(actionParam) || string.IsNullOrWhiteSpace(action))
        {
            return;
        }

        animator.SetTrigger(action.Trim());
    }

    private void ApplyTalkState()
    {
        if (animator == null)
        {
            Debug.LogWarning("UnityAIAgent has no Animator; the response was logged only.", this);
            return;
        }

        if (!string.IsNullOrWhiteSpace(talkTrigger))
        {
            animator.SetTrigger(talkTrigger);
        }

        if (!string.IsNullOrWhiteSpace(talkingBool))
        {
            animator.SetBool(talkingBool, true);
        }

        if (stopTalkingCoroutine != null)
        {
            StopCoroutine(stopTalkingCoroutine);
        }

        stopTalkingCoroutine = StartCoroutine(StopTalkingAfterDelay());
    }

    private IEnumerator StopTalkingAfterDelay()
    {
        yield return new WaitForSeconds(Mathf.Max(0f, talkDurationSeconds));

        if (animator != null && !string.IsNullOrWhiteSpace(talkingBool))
        {
            animator.SetBool(talkingBool, false);
        }

        stopTalkingCoroutine = null;
    }
}
