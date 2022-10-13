import type { BlockData } from 'types/blocks';
import { useState, useEffect } from 'react';
import config from '../../config';

const VersionOverview = ({
  cmf_version,
  pil_version,
  plone_version,
  python_version,
  plone_restapi_version,
  zope_version
}: {
  cmf_version: string;
  pil_version: string;
  plone_version: string;
  python_version: string;
  plone_restapi_version: string;
  zope_version: string;
}) => {
  const { addonsInfo } = config.settings;

  return (
    <>
      <ul
        style={{
          fontSize: '16px',
          fontFamily: 'Monospace'
        }}
      >
        <li>Plone {plone_version}</li>
        <li>plone.restapi {plone_restapi_version}</li>
        <li>CMF {cmf_version}</li>
        <li>Zope {zope_version}</li>
        <li>Python {python_version}</li>
        <li>PIL {pil_version}</li>
      </ul>
      <h3>Add-ons</h3>
      {!(addonsInfo ?? []).length ? (
        <p>No addons</p>
      ) : (
        <ul style={{ fontSize: '16px', fontFamily: 'Monospace' }}>
          {addonsInfo.map((addon: { name: string; version?: string }) => (
            <li key={addon.name}>{`${addon.name} ${addon.version || ''}`}</li>
          ))}
        </ul>
      )}
    </>
  );
};

const SystemView = (props: BlockData) => {
  const API_PATH = config.settings.apiPath;

  const [systemInfo, setSystemInfo] = useState<{
    '@id': string;
    cmf_version: string;
    debug_mode: string;
    pil_version: string;
    plone_version: string;
    python_version: string;
    plone_restapi_version: string;
    zope_version: string;
    [key: string]: string;
  }>();

  return <div className="block system"></div>;
};

export default SystemView;
