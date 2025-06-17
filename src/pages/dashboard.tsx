import React from 'react';
import { BarChart, DollarSign, Users, Package, Calendar, TrendingUp, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-success-600 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">12 departing this week</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">New Clients</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-success-600 flex items-center">
              <TrendingUp className="mr-1 h-3 w-3" />
              +8% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Payments</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,428.30</div>
            <p className="text-xs text-danger-600">7 invoices awaiting payment</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-end justify-between gap-2 pr-6 pb-6">
              {/* Simple bar chart visualization */}
              {[40, 25, 60, 75, 30, 55, 70].map((height, i) => (
                <div key={i} className="relative group">
                  <div
                    className="w-12 bg-primary-200 hover:bg-primary-300 rounded-t transition-all duration-300"
                    style={{ height: `${height}%` }}
                  ></div>
                  <div className="absolute bottom-[-24px] left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'James Cooper', service: 'Cancun Package', amount: '$4,350' },
                { name: 'Maria Garcia', service: 'London Flight', amount: '$980' },
                { name: 'Robert Smith', service: 'Safari Tour', amount: '$2,850' },
                { name: 'Emily Chen', service: 'Paris Hotel', amount: '$1,200' },
              ].map((sale, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary-700" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{sale.name}</p>
                      <p className="text-xs text-gray-500">{sale.service}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium">{sale.amount}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Top Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Cancun, Mexico', percentage: 24 },
                { name: 'Paris, France', percentage: 18 },
                { name: 'Rome, Italy', percentage: 16 },
                { name: 'Bali, Indonesia', percentage: 12 },
                { name: 'New York, USA', percentage: 10 },
              ].map((destination, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div>{destination.name}</div>
                    <div className="font-medium">{destination.percentage}%</div>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-primary-600" 
                      style={{ width: `${destination.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Upcoming Departures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Smith Family', destination: 'Orlando', date: 'May 15, 2025' },
                { name: 'Johnson Group', destination: 'Paris', date: 'May 17, 2025' },
                { name: 'Robert Chen', destination: 'Tokyo', date: 'May 20, 2025' },
                { name: 'Garcia Wedding', destination: 'Cancun', date: 'May 22, 2025' },
              ].map((trip, i) => (
                <div key={i} className="flex items-center border-b pb-2 last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary-500 mr-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{trip.name}</p>
                    <p className="text-xs text-gray-500">{trip.destination}</p>
                  </div>
                  <div className="text-xs text-gray-500">{trip.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Sales by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { type: 'Packages', percentage: 45, color: 'bg-primary-500' },
                { type: 'Flights', percentage: 30, color: 'bg-secondary-500' },
                { type: 'Hotels', percentage: 15, color: 'bg-success-500' },
                { type: 'Transfers', percentage: 10, color: 'bg-warning-500' },
              ].map((sale, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${sale.color} mr-2`}></div>
                      {sale.type}
                    </div>
                    <div className="font-medium">{sale.percentage}%</div>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${sale.color}`} 
                      style={{ width: `${sale.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}