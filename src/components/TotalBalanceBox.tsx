
import React from 'react'
import AnimatedCounter from './AnimatedCounter'
import DonutChart from './DonutChart'

const TotalBalanceBox = ({accounts=[],totalBanks,totalCurrentBalance}:TotalBalanceBoxProps) => {
  return (
    <div>
      <section className='total-balance'>
        <div className='total-balance-chart'>
          <DonutChart accounts={accounts}/>
        </div>
        <div className='flex flex-col gap-6'>
          <h2 className='header-2'>Bank Accounts : {totalBanks}</h2>
          <div className='flex flex-col gap-4'>
            <p className='total-balance-label'>Total Current Balance </p>
            <div className='total-balance-amount'><AnimatedCounter amount={totalCurrentBalance}/></div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TotalBalanceBox
