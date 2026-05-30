import Image from "next/image";
import { ArrowRight, MessageCircle, MoreHorizontal, ShoppingBag, Heart, Bookmark } from "lucide-react";

export default function SocialGlowHubPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 w-full">
      {/* Page Header & Tabs */}
      <div className="mb-10 text-center">
        <h2 className="font-serif text-4xl mb-6 text-on-surface">Community</h2>
        <div className="flex justify-center space-x-2">
          <button className="bg-tertiary text-on-tertiary px-6 py-2 rounded-full font-sans text-sm font-semibold tracking-wide transition-all">Explore</button>
          <button className="bg-surface-container-high text-on-surface px-6 py-2 rounded-full font-sans text-sm font-semibold tracking-wide hover:bg-surface-container transition-all">Following</button>
        </div>
      </div>

      {/* Featured Discussions (Bento Grid) */}
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h3 className="font-serif text-2xl text-on-surface">Join Discussion</h3>
          <a className="font-sans text-primary text-sm font-bold flex items-center hover:opacity-80 transition-opacity" href="#">
            View All <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Large Featured Topic */}
          <div className="md:col-span-2 bg-surface-container-lowest rounded-xl p-6 shadow-ambient relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/20 to-transparent z-0 pointer-events-none"></div>
            <div className="relative z-10 h-full flex flex-col">
              <span className="inline-block bg-primary text-on-primary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">Trending</span>
              <h4 className="font-serif text-xl mb-2 text-on-surface group-hover:text-primary transition-colors">The perfect evening routine for dry skin?</h4>
              <p className="font-sans text-secondary text-sm mb-6 line-clamp-2">I&apos;ve been struggling with dry patches this winter. What are your holy grail products for deep hydration overnight?</p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest relative overflow-hidden">
                    <Image alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIXwWOEu7ukNR6kMlb_7X-BEj4U8sP5718JGL2h7zE0H6pmYTpjzszwxkfkbMJqHr9Y5lHn_rhdSQ5LfuaJHVK7o52ihfJnuuVsU5fT5rr-lDuNENG0pIiiK_QcFJDglw9WQsdEpr9wcT7xlSmkuPednDSOlD2fhGoyskRp1Z3ufTf1MgykBoClix0zk9buUjPAJxhabyRWM2-6GoU8qjqb7jsKAKS8S7VAdwy40MXS_D8fBc0inRrR9nRM3skQMrkAk07kOaehPeS" fill sizes="32px" className="object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest relative overflow-hidden">
                    <Image alt="User" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD-AsQEdP6ulxe7XYrf-pBE70IDKri-A_0IuH_XnOrUCnHXk8A0oyXzRMCYpm-7CW7XQewZyQ7POeeoQ1lY8cAAcLavzffXrJu3MHVBo5wsMZ4uXyltv8trP6bNmo86ylTUFcU5Pc1I0wyZuOrgH_InfA2l47wTECJ-y_sxt2xJCGwcDeObtCn6TTjvoqv8JcBAGRTUgpUToHlbBbHJTtgvbbzKP7S0ShRdxPn24YoqKHgUfx7sfmQxbyl_Ud3YWBw0Dzyn1_Tvy_aN" fill sizes="32px" className="object-cover" />
                  </div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container-high flex items-center justify-center text-xs font-bold text-secondary z-10">+12</div>
                </div>
                <span className="font-sans text-sm text-secondary flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" /> 45
                </span>
              </div>
            </div>
          </div>
          
          {/* Smaller Topic */}
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-ambient flex flex-col">
            <span className="inline-block bg-tertiary-container/30 text-tertiary text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">New</span>
            <h4 className="font-serif text-lg mb-2 text-on-surface">Minimalist makeup looks</h4>
            <p className="font-sans text-secondary text-sm mb-4 line-clamp-3">Sharing my 5-minute glow routine using only 3 products. Perfect for busy mornings.</p>
            <div className="mt-auto flex items-center text-secondary text-sm font-sans">
              <MessageCircle className="w-4 h-4 mr-1" /> 8 replies
            </div>
          </div>
        </div>
      </section>

      {/* Social Feed */}
      <section>
        <div className="space-y-12">
          {/* Post 1: Image Focus */}
          <article className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient">
            {/* User Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden relative">
                  <Image alt="Sarah Jenkins" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApD52-5lVJ9XdjJowWAckgrX9NTIweqZarx-F7FJrxnNKkG1RNrJhdhty7vg2qfxeGP1iQsXhXlWeIll3oJyc2eaQGOmHLzBlFWVXqvDiXarisHgTjo51D0tkED8i8B0UJQ0wSm-YpGDlQDMqeATeWTab0kMzX685Hm6y2WyI-B4g-8q5ZaTX3L5F37ZIAoJf8hnqOKV4-3BHcO-TZaRxySCnPfuM3JqtdG1-ldiuh_c5o2JoAiLoA-mv9n3g4AvMgieg-fCWEvaL9" fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-on-surface text-sm">Sarah Jenkins</h4>
                  <span className="font-sans text-secondary text-xs">2 hours ago</span>
                </div>
              </div>
              <button className="text-secondary hover:text-primary transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content Canvas */}
            <div className="relative aspect-square md:aspect-[4/3] w-full">
              <Image alt="Skincare flatlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo9nDoxJnpaugxS6iD79ne6ccFPD48JNcmRvW3wOd5Z5Yfyf3FOo4OhD03ORsK9dnTOV7ggy7SA0ZItJiDpFE3fm4xjQzEcpuCC6IxKViVEUvsXyDF8l0fTj_dXtYJaCRh5VehlZt73edl8wZQ9fvAg2BeyEjfQbGmUsRoFW-qiC5oOPG0ao-GhcLirdhJjzam4RZX6FRvPrbssKITJAC-ffZ-fQlSbRHUo28hy3343Ixd2hYqDf5lzBNd9I9orORiENM0p3bBDmpn" fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
              
              {/* Shoppable Tags */}
              <div className="absolute bottom-6 left-6 flex space-x-2">
                <div className="bg-surface/90 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center shadow-lg cursor-pointer hover:bg-surface transition-colors">
                  <ShoppingBag className="w-4 h-4 text-primary mr-1" />
                  <span className="font-sans text-xs font-bold text-on-surface">Hydration Serum</span>
                </div>
              </div>
            </div>
            
            {/* Actions & Caption */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex space-x-4">
                  <button className="text-on-surface hover:text-primary transition-colors flex items-center group">
                    <Heart className="w-5 h-5 group-hover:fill-current transition-all" />
                    <span className="ml-1 font-sans text-sm">245</span>
                  </button>
                  <button className="text-on-surface hover:text-primary transition-colors flex items-center">
                    <MessageCircle className="w-5 h-5" />
                    <span className="ml-1 font-sans text-sm">18</span>
                  </button>
                </div>
                <button className="text-on-surface hover:text-primary transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>
              <p className="font-sans text-sm text-on-surface mb-2">
                <span className="font-bold mr-2">Sarah Jenkins</span>
                Sunday reset routine. Focusing entirely on skin barrier repair today after a long week. The new serum is incredibly lightweight but deeply nourishing. ✨ #SundaySkin #BarrierRepair
              </p>
              <button className="font-sans text-secondary text-xs font-medium hover:text-on-surface transition-colors">
                View all 18 comments
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
