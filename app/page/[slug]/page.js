"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Loader2, FileText, Calendar, User } from "lucide-react";
import { api } from "@/lib/api";

export default function DynamicCmsPage({ params }) {
  const { slug } = params;
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPage() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.cms.getPage(slug);
        if (!data || !data.title) {
          throw new Error("Page not found");
        }
        setPage(data);
      } catch (err) {
        console.error("Error loading CMS page:", err);
        setError("This page could not be found or has not been published yet.");
      } finally {
        setLoading(false);
      }
    }
    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-[#f8fafc] flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#0c2340]" size={36} />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container-x py-20 text-center">
        <div className="w-16 h-16 rounded bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
          <FileText size={32} />
        </div>
        <h1 className="text-2xl font-bold text-[#0c2340] mb-2">Page Not Found</h1>
        <p className="text-xs text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
          {error || "The requested document or policy does not exist."}
        </p>
        <Link href="/" className="btn-primary text-xs w-fit mx-auto">
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-8">
      <div className="container-x max-w-4xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-5 flex-wrap">
          <Link href="/" className="hover:text-[#0c2340]">Home</Link>
          <ChevronRight size={12} />
          <span className="text-[#0c2340] font-bold">{page.title}</span>
        </div>

        {/* Page Content Card */}
        <article className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 sm:p-10">
          <header className="border-b border-slate-200 pb-5 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] mb-2">
              {page.title}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
              {page.updatedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-[#c59b27]" />
                  Last Updated: {new Date(page.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              {page.lastUpdatedBy && (
                <span className="flex items-center gap-1.5">
                  <User size={13} className="text-slate-400" />
                  By {page.lastUpdatedBy}
                </span>
              )}
            </div>
          </header>

          {/* Body content with clean prose rendering */}
          <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line">
            {page.content}
          </div>
        </article>
      </div>
    </div>
  );
}
