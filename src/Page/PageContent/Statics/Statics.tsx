import BasicStatics from './BasicStatics/BasicStatics';
import GeographicDistribution from './GeographicDistribution/GeographicDistribution';

import './Statics.css';

export default function Statics() {
  return <div className="Statics">
      <BasicStatics></BasicStatics>
      <GeographicDistribution></GeographicDistribution>
    </div>
  ;
}
