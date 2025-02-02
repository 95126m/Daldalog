import React, { useMemo } from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const ApexChart: React.FC = () => {
  const chartData = useMemo(() => {
    const options: ApexOptions = {
      chart: {
        height: 200,
        type: 'rangeBar'
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      xaxis: {
        type: 'datetime'
      },
      colors: ['#FFCC00']
    }

    const series = [
      {
        data: [
          {
            x: 'User Flow, Design',
            y: [
              new Date('2025-01-10').getTime(),
              new Date('2025-01-12').getTime()
            ]
          },
          {
            x: 'Style: All Pages',
            y: [
              new Date('2025-01-12').getTime(),
              new Date('2025-01-18').getTime()
            ]
          },
          {
            x: 'Feat: Login, Logout',
            y: [
              new Date('2025-01-18').getTime(),
              new Date('2025-01-20').getTime()
            ]
          },
          {
            x: 'Feat: Add, Update, Delete',
            y: [
              new Date('2025-01-20').getTime(),
              new Date('2025-01-23').getTime()
            ]
          },
          {
            x: 'Style: Change Home Page',
            y: [
              new Date('2025-01-23').getTime(),
              new Date('2025-01-24').getTime()
            ]
          },
          {
            x: 'Feat: Search, Todos',
            y: [
              new Date('2025-01-24').getTime(),
              new Date('2025-01-25').getTime()
            ]
          },
          {
            x: 'Feat: thumbnail, image upload',
            y: [
              new Date('2025-01-25').getTime(),
              new Date('2025-01-27').getTime()
            ]
          },
          {
            x: 'Style: animation',
            y: [
              new Date('2025-01-27').getTime(),
              new Date('2025-01-28').getTime()
            ]
          },
        ]
      }
    ]

    return { series, options }
  }, [])

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="rangeBar"
          height={250}
        />
      </div>
    </div>
  )
}

export default ApexChart
