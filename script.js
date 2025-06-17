const cacheName = 'dynamic-agent-v1';

const handlePictureInPictureRequest = async event => {
  if (event.data.type !== 'jf-request-pip-window') {
    return;
  }
  const { url, width, height } = event.data;
  if ('documentPictureInPicture' in window) {
    // return if already in picture in picture mode
    if (window.documentPictureInPicture.window) {
      return;
    }
    const pipWindow = await window.documentPictureInPicture.requestWindow({
      width,
      height,
      disallowReturnToOpener: true
    });
    // copy styles from main window to pip window
    [...document.styleSheets].forEach(styleSheet => {
      try {
        const cssRules = [...styleSheet.cssRules]
          .map(rule => rule.cssText)
          .join('');
        const style = document.createElement('style');
        style.textContent = cssRules;
        pipWindow.document.head.appendChild(style);
      } catch (e) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = styleSheet.type;
        link.media = styleSheet.media;
        link.href = styleSheet.href;
        pipWindow.document.head.appendChild(link);
      }
    });
    pipWindow.document.body.innerHTML = `<iframe src="${url}" style="width: ${width}px; height: ${height}px;" allow="microphone *; display-capture *;"></iframe>`;
    return { success: true, isActive: false };
  }
};

window.addEventListener('message', handlePictureInPictureRequest);

const src = "https://www.jotform.com/s/umd/4f0f5d4aedd/for-embedded-agent.js";
const script = document.createElement('script');
script.src = src;
script.async = true;
script.onload = function() {
  window.AgentInitializer.init({
    agentRenderURL: "https://www.jotform.com/agent/01977e0b8f9271609e55ab7b7c4a008c1005",
    rootId: "JotformAgent-01977e0b8f9271609e55ab7b7c4a008c1005",
    formID: "01977e0b8f9271609e55ab7b7c4a008c1005",
    contextID: "01977e12003475f3aa8a8b8162b7540cc00a",
    initialContext: "",
    queryParams: ["skipWelcome=1","maximizable=1","skipWelcome=1","maximizable=1","isNoupeAgent=1"],
    domain: "https://www.jotform.com",
    isDraggable: false,
    background: "linear-gradient(180deg, #6C73A8 0%, #6C73A8 100%)",
    buttonBackgroundColor: "#0066C3",
    buttonIconColor: "#FFFFFF",
    inputTextColor: "#01105C",
    variant: false,
    customizations: {
      inputPlaceholder: "Ask Noupe AI about this website"
    },
    isVoice: false,
    isVoiceWebCallEnabled: false
  });
};
document.head.appendChild(script);