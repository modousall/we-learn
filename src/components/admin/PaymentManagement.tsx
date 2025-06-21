
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, DollarSign, TrendingUp, Users, Calendar, Download } from 'lucide-react';

interface Transaction {
  id: string;
  user_email: string;
  course_title: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

export const PaymentManagement = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock transaction data
    const mockTransactions: Transaction[] = [
      {
        id: '1',
        user_email: 'user1@example.com',
        course_title: 'Gestion budgétaire avancée',
        amount: 2500,
        currency: 'FCFA',
        payment_method: 'Orange Money',
        status: 'completed',
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        user_email: 'user2@example.com',
        course_title: 'Cryptomonnaies pour débutants',
        amount: 3000,
        currency: 'FCFA',
        payment_method: 'Wave',
        status: 'completed',
        created_at: '2024-01-14T14:20:00Z'
      },
      {
        id: '3',
        user_email: 'user3@example.com',
        course_title: 'IA et productivité',
        amount: 1500,
        currency: 'FCFA',
        payment_method: 'Carte bancaire',
        status: 'pending',
        created_at: '2024-01-13T09:15:00Z'
      },
      {
        id: '4',
        user_email: 'user4@example.com',
        course_title: 'Blockchain simplifiée',
        amount: 4000,
        currency: 'FCFA',
        payment_method: 'Orange Money',
        status: 'failed',
        created_at: '2024-01-12T16:45:00Z'
      }
    ];

    setTransactions(mockTransactions);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Complété';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      default:
        return status;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    return <CreditCard className="h-4 w-4" />;
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.status === filter);

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const completedTransactions = transactions.filter(t => t.status === 'completed').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Chargement des paiements...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenus Total</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} FCFA</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Transactions Réussies</p>
                <p className="text-2xl font-bold">{completedTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-2xl font-bold">{pendingTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de Conversion</p>
                <p className="text-2xl font-bold">73%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6" />
              <span>Gestion des Paiements ({filteredTransactions.length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les transactions</SelectItem>
                  <SelectItem value="completed">Complétées</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="failed">Échouées</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Aucune transaction trouvée</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{transaction.course_title}</h3>
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusLabel(transaction.status)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{transaction.user_email}</span>
                      <div className="flex items-center space-x-1">
                        {getPaymentMethodIcon(transaction.payment_method)}
                        <span>{transaction.payment_method}</span>
                      </div>
                      <span>{new Date(transaction.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </p>
                    {transaction.status === 'pending' && (
                      <Button variant="outline" size="sm" className="mt-2">
                        Traiter
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration des Moyens de Paiement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Orange Money</h3>
                <Badge className="bg-orange-100 text-orange-800">Actif</Badge>
              </div>
              <p className="text-sm text-gray-600">Intégration API Orange Money</p>
              <Button variant="outline" size="sm" className="mt-2">
                Configurer
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Wave</h3>
                <Badge className="bg-blue-100 text-blue-800">Actif</Badge>
              </div>
              <p className="text-sm text-gray-600">Intégration API Wave</p>
              <Button variant="outline" size="sm" className="mt-2">
                Configurer
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Cartes Bancaires</h3>
                <Badge className="bg-green-100 text-green-800">Actif</Badge>
              </div>
              <p className="text-sm text-gray-600">Stripe / PayDunya</p>
              <Button variant="outline" size="sm" className="mt-2">
                Configurer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
