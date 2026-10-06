import prisma from '@/lib/prisma';
import { format } from 'date-fns';

export const revalidate = 0; // Disable caching to always show latest

export default async function ConsultationsPage() {
  const requests = await prisma.consultationRequest.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wider">Consultation Requests</h1>
          <p className="text-sm text-slate-400 mt-1">Leads from the website contact form</p>
        </div>
        <div className="bg-[#1c2238] border border-[#2b3554] rounded-xl px-4 py-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Total</span>
          <div className="text-xl font-black text-white leading-none mt-1">{requests.length}</div>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="p-12 bg-[#111520] border border-[#1f2947] rounded-3xl text-center">
          <p className="text-slate-400">No consultation requests yet.</p>
        </div>
      ) : (
        <div className="bg-[#111520] border border-[#1f2947] rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#161b29] text-xs uppercase tracking-wider font-semibold text-slate-400 border-b border-[#1f2947]">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Restaurant</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Email / Phone</th>
                  <th className="px-6 py-4 w-1/3">Message</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f2947]">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-[#1a2035] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                      {format(new Date(req.createdAt), 'dd MMM yyyy, HH:mm')}
                    </td>
                    <td className="px-6 py-4 font-bold text-white">
                      {req.restaurantName}
                    </td>
                    <td className="px-6 py-4">
                      {req.contactName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <a href={`mailto:${req.emailAddress}`} className="text-blue-400 hover:underline">{req.emailAddress}</a>
                        {req.phoneNumber && <span className="text-slate-400 text-xs">{req.phoneNumber}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs leading-relaxed text-slate-400">
                      {req.message}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2.5 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
