/** Hero section — white cards, #F58220 orange accent, #1B2A4A navy, #E8E4DF border. */

export const heroCategoryCard =
  'group flex flex-col rounded-lg border border-[#E8E4DF] border-l-[4px] border-l-[#F58220] bg-white p-4 transition-all duration-300 ease-out hover:border-[#E8E4DF] hover:shadow-[0_10px_28px_-14px_rgba(27,42,74,0.14)]'

/** Homepage hero — navy category tiles with depth */
export const heroNavyCategoryCard =
  'group relative flex h-full flex-col overflow-hidden rounded-xl border border-[#1a3a6e]/70 bg-gradient-to-br from-[#133066] via-[#0c2147] to-[#071530] p-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_2px_4px_rgba(0,0,0,0.12),0_8px_20px_-6px_rgba(7,26,87,0.55)] transition-all duration-300 ease-out hover:-translate-y-1 hover:border-[#F58220]/35 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_4px_8px_rgba(0,0,0,0.18),0_16px_32px_-8px_rgba(245,130,32,0.22)] sm:p-3.5'

export const heroNavyIconTile =
  'mb-2 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-gradient-to-br from-white/[0.12] to-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_3px_10px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-105'

export const heroAccentPanel =
  'rounded-lg border border-[#E8E4DF] border-l-[4px] border-l-[#F58220] bg-white p-3 sm:p-3.5 transition-shadow duration-300 hover:shadow-[0_10px_28px_-14px_rgba(27,42,74,0.12)]'

export const heroInputRow =
  'flex overflow-hidden rounded-md border border-[#E8E4DF] bg-white transition-all duration-300 ease-out focus-within:border-[#F58220] focus-within:ring-1 focus-within:ring-[#F58220]/15'

export const heroBtn3d =
  'bg-[#F58220] transition-all duration-200 ease-out hover:bg-[#e67410] active:opacity-90'

export const heroTag3d =
  'rounded-md border border-[#E8E4DF] bg-white px-2 py-0.5 text-[11px] font-medium text-[#1B2A4A] transition-all duration-200 ease-out hover:border-[#F58220] hover:text-[#F58220]'

/** @deprecated use heroCategoryCard */
export const heroCard3d = heroCategoryCard

/** @deprecated use heroAccentPanel */
export const heroPanel3d = heroAccentPanel

export const heroQuotesBtn3d =
  'text-[#F58220] font-semibold transition-colors duration-200 hover:text-[#e67410]'
