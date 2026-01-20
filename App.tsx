
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Trash2, Printer, RefreshCw, CheckCircle, FileDown } from 'lucide-react';
import { InvoiceItem } from './types';

const App: React.FC = () => {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', name: '', quantity: 1, price: 0 }
  ]);
  const [maintenanceFee, setMaintenanceFee] = useState<number>(0);
  const [showNotification, setShowNotification] = useState(false);

  // إخفاء الإشعار تلقائياً بعد 5 ثوانٍ (زيادة الوقت قليلاً ليتمكن المستخدم من القراءة)
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Math.random().toString(36).substr(2, 9), name: '', quantity: 1, price: 0 }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }, [items]);

  const grandTotal = subtotal + maintenanceFee;

  const handlePrint = () => {
    // إظهار الإشعار
    setShowNotification(true);
    
    // تقليل وقت التأخير إلى 100 ملي ثانية فقط لضمان عدم اعتبار المتصفح للأمر كإجراء غير مرغوب فيه
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const resetInvoice = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين الفاتورة؟')) {
      setItems([{ id: '1', name: '', quantity: 1, price: 0 }]);
      setMaintenanceFee(0);
      setDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:py-8 relative">
      
      {/* إشعار تأكيد الطباعة (يظهر فقط في البرنامج) */}
      {showNotification && (
        <div className="no-print fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce border-2 border-white cursor-pointer" onClick={() => window.print()}>
          <FileDown size={28} />
          <div className="flex flex-col">
            <span className="font-bold text-lg">جاري فتح نافذة الطباعة...</span>
            <span className="text-sm opacity-90">إذا لم تفتح النافذة، اضغط هنا</span>
          </div>
        </div>
      )}

      {/* Input Controls - Hidden during print */}
      <div className="no-print bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">إعداد الفاتورة</h1>
          <div className="flex gap-2">
            <button 
              onClick={resetInvoice}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <RefreshCw size={18} />
              إعادة تعيين
            </button>
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-all shadow-lg hover:shadow-xl"
            >
              <Printer size={18} />
              حفظ / طباعة (PDF)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رسوم الصيانة والنقل</label>
            <input 
              type="number" 
              step="any"
              value={maintenanceFee || ''}
              onChange={(e) => setMaintenanceFee(Number(e.target.value))}
              placeholder="0.00"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-gray-50 text-right border-b">
                <th className="p-3 font-semibold text-gray-600">الصنف</th>
                <th className="p-3 font-semibold text-gray-600 w-24 text-center">العدد</th>
                <th className="p-3 font-semibold text-gray-600 w-32 text-center">السعر</th>
                <th className="p-3 font-semibold text-gray-600 w-16"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="p-3">
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="اسم المنتج أو الصنف..."
                      className="w-full border-none focus:ring-1 focus:ring-blue-200 rounded px-2 py-1 outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      step="any"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      className="w-full text-center border-none focus:ring-1 focus:ring-blue-200 rounded px-2 py-1 outline-none"
                    />
                  </td>
                  <td className="p-3">
                    <input 
                      type="number" 
                      step="any"
                      value={item.price || ''}
                      onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                      className="w-full text-center border-none focus:ring-1 focus:ring-blue-200 rounded px-2 py-1 outline-none"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="حذف البند"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button 
          onClick={addItem}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Plus size={20} />
          إضافة بند جديد
        </button>
      </div>

      {/* Actual Invoice - Printable View */}
      <div className="invoice-container bg-white shadow-2xl p-8 md:p-12 min-h-[29.7cm] relative">
        {/* Background watermark effect if needed */}
        <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden opacity-5">
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] border-[40px] border-[#1e3a5f] rotate-45"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] border-[40px] border-[#1e3a5f] rotate-45"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-[#1e3a5f] mb-4">فاتورة</h1>
          <div className="flex justify-end text-lg font-bold">
             <span>التاريخ: {date.replace(/-/g, '/')}</span>
          </div>
        </div>

        {/* Main Table */}
        <div className="mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#1e3a5f] text-white">
                <th className="border border-white p-3 w-16 text-center">م</th>
                <th className="border border-white p-3 text-center text-xl">الصنف</th>
                <th className="border border-white p-3 w-24 text-center">العدد</th>
                <th className="border border-white p-3 w-40 text-center">السعر</th>
                <th className="border border-white p-3 w-48 text-center">الاجمالي</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="bg-white">
                  <td className="border border-gray-300 p-3 text-center font-bold">{index + 1}</td>
                  <td className="border border-gray-300 p-3 text-right">{item.name || '---'}</td>
                  <td className="border border-gray-300 p-3 text-center">{item.quantity}</td>
                  <td className="border border-gray-300 p-3 text-center">{item.price.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                  <td className="border border-gray-300 p-3 text-center font-bold">{(item.quantity * item.price).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
              
              {/* Summary Rows */}
              <tr>
                <td colSpan={3} className="border-0"></td>
                <td className="border border-gray-300 bg-gray-100 p-3 text-center font-bold">الاجمالي</td>
                <td className="border border-gray-300 p-3 text-center font-bold">{subtotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr>
                <td colSpan={3} className="border-0"></td>
                <td className="border border-gray-300 bg-gray-100 p-3 text-center font-bold">الصيانة والنقل</td>
                <td className="border border-gray-300 p-3 text-center font-bold">{maintenanceFee.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
              </tr>
              <tr className="bg-[#1e3a5f] text-white">
                <td colSpan={3} className="border-0"></td>
                <td className="border border-white p-3 text-center font-bold text-sm">الاجمالي شامل الصيانه والنقل</td>
                <td className="border border-white p-3 text-center font-bold text-xl">{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Helper Footer */}
      <footer className="no-print mt-12 text-center text-gray-500 text-sm">
        <p>تم التصميم باحترافية لتناسب متطلبات العمل. اضغط "حفظ / طباعة" للحصول على نسخة PDF.</p>
      </footer>
    </div>
  );
};

export default App;
