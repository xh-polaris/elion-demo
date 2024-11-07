import './BasicStatics.css';
import '../GeographicDistribution/GeographicDistribution.css'


const statisticsData = [
  {
    icon: '/images/logo/students_number.png',
    value: '19063',
    label: '学生总数',
    unit: '人'
  },
  {
    icon: '/images/logo/student.png',
    value: '676',
    label: '学生总数',
    unit: '人'
  },
  {
    icon: '/images/logo/active_number.png',
    value: '4022',
    label: '活跃数量',
    unit: '人'
  },
  {
    icon: '/images/logo/school_number.png',
    value: '256',
    label: '学校总数',
    unit: '所'
  },
  {
    icon: '/images/logo/essay_number.png',
    value: '56722',
    label: '作文总数',
    unit: '篇'
  },
  {
    icon: '/images/logo/example_number.png',
    value: '1643',
    label: '范文数量',
    unit: '篇'
  }
];

export default function BasicStatics() {
  return <div className="BasicStatics">
    <div className="Title">
        <div className="TitleText">基础数据</div>
        <img src='/images/icons/right.svg' alt='' className='TitleIcon'/>
      </div>
      <div className="Divider"></div>
      <div className="Content">
        <div className="GridContainer">
          {statisticsData.map((item, index) => (
            <div className="GridItem" key={index}>
              <img src={item.icon} alt="" className="ItemIcon"/>
              <div className="ItemText">
                <div className="ItemLabel">{item.label}</div>
                <div className="ItemValue">
                  {item.value}<span className="ItemUnit">{item.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
  </div>;
}
