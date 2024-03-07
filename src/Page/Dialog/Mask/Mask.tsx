import React from 'react';

import { useDialog } from '@store';

import './Mask.css';

export default function Mask() {
  const { toggleActive } = useDialog(state => state);

  return <div className="Mask" onClick={() => toggleActive(false)}></div>;
}
