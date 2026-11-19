'use client'

import { Product } from '@/lib/products'
import { Enquiry } from '@/lib/enquiries'
import BarChart from './charts/BarChart'
import DonutChart from './charts/DonutChart'
import { Badge, Card, Icon, KpiCard, PageHeader } from './admin/ui'
import { AnimatedNumber, FadeUp } from './charts/motion'

const SLICE_COLORS = [
  '#F0800A',
  '#A02638',
  '#1B5A80',
  '#4F8642',
  '#5E4B84',
  '#C79A48',
]

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`

export default function AnalyticsPanel({
  products,
  enquiries,
}: {
  products: Product[]
  enquiries: Enquiry[]
}) {
  const stockValue = products.reduce((s, p) => s + p.mrp * p.stockQty, 0)
  const totalUnits = products.reduce((s, p) => s + p.stockQty, 0)
  const avgMrp =
    products.length === 0
      ? 0
      : products.reduce((s, p) => s + p.mrp, 0) / products.length
  const lowStock = products.filter((p) => p.stock === 'Low Stock')
  const inStockCount = products.length - lowStock.length

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.cat] = (acc[p.cat] || 0) + 1
    return acc
  }, {})
  const categoryData = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value]) => ({ label, value }))

  const byForm = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1
    return acc
  }, {})
  const formData = Object.entries(byForm)
    .sort((a, b) => b[1] - a[1])
    .map(([label, value], i) => ({
      label,
      value,
      color: SLICE_COLORS[i % SLICE_COLORS.length],
    }))

  const stockData = [
    { label: 'In Stock', value: inStockCount, color: '#4F8642' },
    { label: 'Low Stock', value: lowStock.length, color: '#A02638' },
  ]

  const newEnquiries = enquiries.filter((e) => e.status === 'New').length
  const enquiryStatusData = [
    { label: 'New', value: newEnquiries, color: '#F0800A' },
    {
      label: 'Responded',
      value: enquiries.length - newEnquiries,
      color: '#4F8642',
    },
  ]

  // Ratings are mostly the 4.5 default, so rank by money tied up in stock instead.
  const topByValue = [...products]
    .map((p) => ({ label: p.name, value: Math.round(p.mrp * p.stockQty) }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 6)

  const lowStockList = [...lowStock]
    .sort((a, b) => a.stockQty - b.stockQty)
    .slice(0, 6)

  const topCategory = categoryData[0]

  return (
    <div>
      <PageHeader
        title='Analytics'
        subtitle='Catalog and enquiry performance at a glance.'
      />

      {/* KPI row */}
      <div className='grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-5 md:mb-6'>
        <FadeUp delay={0} className='[&>*]:h-full'>
          <KpiCard
            label='Products Listed'
            value={<AnimatedNumber value={products.length} />}
            hint={`Across ${categoryData.length} ${
              categoryData.length === 1 ? 'category' : 'categories'
            }`}
            icon='products'
          />
        </FadeUp>
        <FadeUp delay={90} className='[&>*]:h-full'>
          <KpiCard
            label='Stock Value at MRP'
            value={
              <AnimatedNumber value={stockValue} format={inr} duration={1500} />
            }
            hint={`${totalUnits.toLocaleString('en-IN')} units on hand`}
            icon='rupee'
            tone='navy'
          />
        </FadeUp>
        <FadeUp delay={180} className='[&>*]:h-full'>
          <KpiCard
            label='Average MRP'
            value={<AnimatedNumber value={avgMrp} format={inr} />}
            hint='Per unit, across all products'
            icon='analytics'
            tone='amber'
          />
        </FadeUp>
        <FadeUp delay={270} className='[&>*]:h-full'>
          <KpiCard
            label='Low Stock Items'
            value={
              <AnimatedNumber
                value={lowStock.length}
                format={(n) => `${n} / ${products.length}`}
              />
            }
            hint={
              lowStock.length === 0
                ? 'Everything is well stocked'
                : 'Needs reordering soon'
            }
            icon={lowStock.length === 0 ? 'check' : 'alert'}
            tone={lowStock.length === 0 ? 'green' : 'red'}
          />
        </FadeUp>
      </div>

      {/* Category + stock health */}
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5 mb-4 md:mb-5'>
        <FadeUp className='lg:col-span-3' delay={80}>
          <Card
            className='h-full'
            title='Products by Category'
            action={
              topCategory && (
                <Badge tone='green'>Top: {topCategory.label}</Badge>
              )
            }
          >
            {categoryData.length === 0 ? (
              <Empty />
            ) : (
              <BarChart data={categoryData} limit={7} showShare />
            )}
          </Card>
        </FadeUp>

        <FadeUp className='lg:col-span-2' delay={160}>
          <Card
            className='h-full'
            bodyClassName='flex flex-col justify-center'
            title='Stock Health'
          >
            {products.length === 0 ? (
              <Empty />
            ) : (
              <DonutChart
                data={stockData}
                centerLabel='Products'
                unit='products'
              />
            )}
          </Card>
        </FadeUp>
      </div>

      {/* Form + enquiries */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5'>
        <FadeUp delay={0}>
          <Card
            className='h-full'
            bodyClassName='flex flex-col justify-center'
            title='Products by Form'
          >
            {formData.length === 0 ? (
              <Empty />
            ) : (
              <DonutChart
                data={formData}
                centerLabel='Products'
                unit='products'
              />
            )}
          </Card>
        </FadeUp>
        <FadeUp delay={120}>
          <Card
            className='h-full'
            bodyClassName='flex flex-col justify-center'
            title='Enquiry Status'
            action={
              newEnquiries > 0 && (
                <Badge tone='amber' dot>
                  {newEnquiries} awaiting reply
                </Badge>
              )
            }
          >
            {enquiries.length === 0 ? (
              <Empty
                icon='enquiries'
                text='No enquiries yet. They will show up here once customers contact you.'
              />
            ) : (
              <DonutChart
                data={enquiryStatusData}
                centerLabel='Enquiries'
                unit='enquiries'
              />
            )}
          </Card>
        </FadeUp>
      </div>

      {/* Stock value + attention list */}
      <div className='grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-5'>
        <FadeUp className='lg:col-span-3' delay={0}>
          <Card className='h-full' title='Top Products by Stock Value'>
            {topByValue.length === 0 ? (
              <Empty />
            ) : (
              <BarChart data={topByValue} valuePrefix='₹' />
            )}
          </Card>
        </FadeUp>

        <FadeUp className='lg:col-span-2' delay={120}>
          <Card className='h-full' title='Needs Attention'>
            {lowStockList.length === 0 ? (
              <Empty
                icon='check'
                text='No low-stock products right now. Nice work!'
              />
            ) : (
              <ul className='divide-y divide-line -my-2'>
                {lowStockList.map((p) => (
                  <li
                    key={p.id}
                    className='flex items-center justify-between gap-3 py-3'
                  >
                    <div className='min-w-0'>
                      <div className='text-[13px] font-bold text-navy truncate'>
                        {p.name}
                      </div>
                      <div className='text-[11.5px] text-muted'>{p.cat}</div>
                    </div>
                    <Badge tone={p.stockQty === 0 ? 'red' : 'amber'} dot>
                      {p.stockQty === 0 ? 'Out of stock' : `${p.stockQty} left`}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </FadeUp>
      </div>
    </div>
  )
}

function Empty({
  text = 'Not enough data yet.',
  icon = 'analytics',
}: {
  text?: string
  icon?: 'analytics' | 'enquiries' | 'check'
}) {
  return (
    <div className='flex flex-col items-center text-center py-8'>
      <span className='w-11 h-11 rounded-full bg-forest-pale text-forest flex items-center justify-center mb-3'>
        <Icon name={icon} size={20} />
      </span>
      <p className='text-[13px] text-muted max-w-[260px]'>{text}</p>
    </div>
  )
}
