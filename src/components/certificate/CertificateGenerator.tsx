
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Award, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string;
  score: number;
  duration: string;
  certificateId: string;
}

interface CertificateGeneratorProps {
  certificateData: CertificateData;
  onDownload: () => void;
}

export const CertificateGenerator = ({ certificateData, onDownload }: CertificateGeneratorProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    // Ici on intégrerait une librairie comme jsPDF ou react-pdf
    toast({
      title: "Certificat généré !",
      description: "Votre certificat a été téléchargé avec succès.",
    });
    onDownload();
  };

  const generateCertificatePreview = () => {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-lg border-4 border-blue-200">
        <div className="text-center">
          {/* Header */}
          <div className="mb-6">
            <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">CERTIFICAT DE RÉUSSITE</h1>
            <p className="text-lg text-gray-600">WL - We Learn Platform</p>
          </div>

          {/* Content */}
          <div className="mb-8">
            <p className="text-lg text-gray-700 mb-4">Ceci certifie que</p>
            <h2 className="text-4xl font-bold text-blue-600 mb-4">{certificateData.studentName}</h2>
            <p className="text-lg text-gray-700 mb-2">a terminé avec succès le cours</p>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">"{certificateData.courseName}"</h3>
            
            <div className="flex justify-center items-center space-x-6 mb-6">
              <div className="text-center">
                <Badge variant="outline" className="mb-2">Score</Badge>
                <p className="text-xl font-bold text-green-600">{certificateData.score}%</p>
              </div>
              <div className="text-center">
                <Badge variant="outline" className="mb-2">Durée</Badge>
                <p className="text-xl font-bold text-blue-600">{certificateData.duration}</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-gray-200 pt-6">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <p className="text-sm text-gray-600">Date de completion</p>
                <p className="font-semibold">{new Date(certificateData.completionDate).toLocaleDateString('fr-FR')}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Certificat ID</p>
                <p className="font-mono text-sm">{certificateData.certificateId}</p>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Certificat vérifié et émis par WL - We Learn Platform
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-6 w-6 text-yellow-500" />
            <span>Votre Certificat de Réussite</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-600 font-medium">Cours terminé avec succès !</span>
            </div>
            <Button onClick={handleDownload} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Télécharger PDF</span>
            </Button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Détails du certificat :</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Cours :</span>
                <span className="ml-2 font-medium">{certificateData.courseName}</span>
              </div>
              <div>
                <span className="text-gray-600">Score :</span>
                <span className="ml-2 font-medium text-green-600">{certificateData.score}%</span>
              </div>
              <div>
                <span className="text-gray-600">Date :</span>
                <span className="ml-2 font-medium">
                  {new Date(certificateData.completionDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Durée :</span>
                <span className="ml-2 font-medium">{certificateData.duration}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificate Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Aperçu du certificat</CardTitle>
        </CardHeader>
        <CardContent>
          {generateCertificatePreview()}
        </CardContent>
      </Card>
    </div>
  );
};
