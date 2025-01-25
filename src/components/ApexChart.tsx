import React, { useState } from 'react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const ApexChart: React.FC = () => {
  const [state, setState] = useState<{
    series: {
      data: {
        x: string
        y: [number, number]
      }[]
    }[]
    options: ApexOptions
  }>({
    series: [
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
          }
        ]
      }
    ],
    options: {
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
  })

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={state.options}
          series={state.series}
          type="rangeBar"
          height={250}
        />
      </div>
    </div>
  )
}

export default ApexChart
