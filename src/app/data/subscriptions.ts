import { Subscription } from '@/app/components/SubscriptionCard';

export const subscriptions: Subscription[] = [
  {
    id: '1',
    operator: 'Telia',
    data: '100 GB',
    price: 349,
    campaignPrice: 249,
    campaignInfo: '3 mån kampanj',
    bindingPeriod: 'Ingen bindningstid',
    hasESim: true,
    hasEURoaming: true,
    speed: '5G'
  },
  {
    id: '2',
    operator: 'Telenor',
    data: 'Obegränsad',
    price: 399,
    campaignPrice: 299,
    campaignInfo: 'Första året',
    bindingPeriod: 'Ingen bindningstid',
    hasESim: true,
    hasEURoaming: true,
    speed: '5G'
  },
  {
    id: '3',
    operator: 'Tre',
    data: '50 GB',
    price: 199,
    bindingPeriod: 'Ingen bindningstid',
    hasESim: false,
    hasEURoaming: true,
    speed: '4G+'
  },
  {
    id: '4',
    operator: 'Hallon',
    data: '25 GB',
    price: 149,
    bindingPeriod: 'Ingen bindningstid',
    hasESim: true,
    hasEURoaming: false,
    speed: '4G'
  },
  {
    id: '5',
    operator: 'Comviq',
    data: '100 GB',
    price: 299,
    campaignPrice: 199,
    campaignInfo: '6 mån kampanj',
    bindingPeriod: 'Ingen bindningstid',
    hasESim: false,
    hasEURoaming: true,
    speed: '5G'
  },
  {
    id: '6',
    operator: 'Vimla',
    data: '30 GB',
    price: 169,
    bindingPeriod: 'Ingen bindningstid',
    hasESim: true,
    hasEURoaming: false,
    speed: '4G'
  },
  {
    id: '7',
    operator: 'Tele2',
    data: '80 GB',
    price: 299,
    campaignPrice: 249,
    campaignInfo: '3 mån kampanj',
    bindingPeriod: 'Ingen bindningstid',
    hasESim: true,
    hasEURoaming: true,
    speed: '5G'
  },
  {
    id: '8',
    operator: 'Fello',
    data: '20 GB',
    price: 129,
    bindingPeriod: 'Ingen bindningstid',
    hasESim: false,
    hasEURoaming: false,
    speed: '4G'
  },
  {
    id: '9',
    operator: 'Telia',
    data: '50 GB',
    price: 299,
    bindingPeriod: '12 månader',
    hasESim: true,
    hasEURoaming: true,
    speed: '5G'
  },
  {
    id: '10',
    operator: 'Halebop',
    data: '40 GB',
    price: 229,
    bindingPeriod: 'Ingen bindningstid',
    hasESim: true,
    hasEURoaming: true,
    speed: '4G+'
  },
  {
    id: '11',
    operator: 'Tre',
    data: 'Obegränsad',
    price: 449,
    campaignPrice: 349,
    campaignInfo: '3 mån kampanj',
    bindingPeriod: 'Ingen bindningstid',
    hasESim: false,
    hasEURoaming: true,
    speed: '5G'
  },
  {
    id: '12',
    operator: 'Hallon',
    data: '50 GB',
    price: 199,
    bindingPeriod: 'Ingen bindningstid',
    hasESim: true,
    hasEURoaming: false,
    speed: '4G+'
  },
];
