const Footer = () => (
  <footer id="footer" role="contentinfo">
    <div className="container">
      <p className="content-info">
        The Plone<sup>®</sup> Open Source CMS/WCM is{' '}
        <abbr title="Copyright">©</abbr> 2000-2022 by the{' '}
        <a className="item" href="http://plone.org/foundation">
          Plone Foundation
        </a>{' '}
        and friends. Distributed under the{' '}
        <a className="item" href="http://creativecommons.org/licenses/GPL/2.0/">
          GNU GPL license
        </a>
        .
      </p>
      <ul className="link-list">
        <li>
          <a href="https://6.demo.plone.org/sitemap" className="item">
            Sitemap
          </a>
        </li>
        <li>
          <a href="https://6.demo.plone.org/accesibility-info" className="item">
            Accessibility
          </a>
        </li>
        <li>
          <a href="https://6.demo.plone.org/contact-form" className="item">
            Contact
          </a>
        </li>
        <li>
          <a href="https://plone.org/" className="item">
            Powered by Plone & Python
          </a>
        </li>
      </ul>
    </div>
  </footer>
);

export default Footer;
