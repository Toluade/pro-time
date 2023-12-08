import "./style.scss";

const DownloadDesktopApp = () => {
  return (
    <section className="download-popover">
      <h2 className="title">Download Desktop App</h2>
      <div className="link-wrapper">
        <a
          className="link"
          target="_blank"
          rel="noopener"
          href="https://drive.google.com/file/d/1eCnPhuGOW7RzbAQRlwJuIVU02UoTsB-K/view?usp=drive_link"
        >
          ProTime for Mac
        </a>
        <a
          className="link"
          target="_blank"
          rel="noopener"
          href="https://drive.google.com/file/d/1zmli1eVoiRGU2RHPKfYDbtrwQYSgmXYf/view?usp=drive_link"
        >
          ProTime for Windows
        </a>
      </div>

      <p className="note">
        Apps are not signed, so opening the app may be blocked by your system.
        You can enable the app to open in your security settings.
      </p>
    </section>
  );
};

export default DownloadDesktopApp;
