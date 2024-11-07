import './GeographicDistribution.css'


export default function GeographicDistribution() {
  const top5Schools = [
    { name: "上海市协和双语尚音融合部", count: 210 },
    { name: "江苏省南京市月苑第一小学", count: 143 },
    { name: "上海市宝山区宝虹小学", count: 135 },
    { name: "广东省深圳市碧波小学", count: 126 },
    { name: "上海市金州小学", count: 98 }
  ];

  return <div className="GeographicDistribution">
      <div className="Title">
        <div className="TitleText">城市分布</div>
        <img src='/images/icons/right.svg' alt='' className='TitleIcon'/>
      </div>
      <div className="Divider"></div>
      <div className="Content">
        <div className="Dropdown">
          <div className="DropdownText">学校数量</div>
          <img src='/images/icons/drop-down.png' alt='' className='DropdownIcon'/>
        </div>  
        <div className="ChartContainer"><img src='/images/logo/chart.png' alt=''/></div>
        <div className="MapContainer"><img src='/images/logo/map.png' alt=''/></div>  
        <div className="Top5">
          <div className="Top5Title">高频活跃学校Top5</div>
          <div className="Top5Content">
            <ul className="Top5List">
              {top5Schools.map((school, index) => (
                <li key={index} className="Top5Item">
                  <div className="Top5ItemLeft"> 
                    <span className="Top5Index">{index + 1}</span>
                    <span className="SchoolName">{school.name}</span>
                  </div>
                  <span className="ActivityCount">{school.count}次</span>
                </li>
              ))}
            </ul>
          </div> 
        </div>
      </div>
    </div>
}
