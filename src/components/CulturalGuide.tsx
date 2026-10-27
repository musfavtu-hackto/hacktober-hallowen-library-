import React from 'react';
import { Flame, Sparkles, Heart, Flower2, Image, ShieldCheck, BookOpen } from 'lucide-react';

export const CulturalGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-mono text-amber-500 mb-2">
          <Flower2 className="w-3.5 h-3.5" />
          <span>CULTURAL RESPECT & AUTHENTIC COMMEMORATION</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-stone-100 mb-3">
          The Traditions of Día de los Muertos
        </h2>
        <p className="font-cormorant text-lg text-stone-300 italic">
          Why Día de Muertos is a celebration of love, remembrance, and community—not horror or malice.
        </p>
      </div>

      {/* Main Philosophy Card */}
      <div className="bg-[#0e0e14] border border-amber-900/50 rounded-2xl p-6 lg:p-8 mb-8 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-400 shrink-0">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-cinzel text-xl font-bold text-stone-100 mb-2">
              The Heart of Remembrance: The Three Deaths
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed font-sans mb-3">
              In traditional Mexican and Mesoamerican philosophies, death is not the opposite of life, but part of a sacred continuum. There is a deeply poignant belief that every human being experiences three deaths:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-stone-300 font-sans mb-4 leading-relaxed">
              <li><strong className="text-amber-200">The First Death:</strong> When the physical body ceases to breathe.</li>
              <li><strong className="text-amber-200">The Second Death:</strong> When the body is laid to rest in the earth.</li>
              <li><strong className="text-amber-200">The Third Death (The True Death):</strong> When there is no one left on earth who speaks your name or remembers who you were.</li>
            </ol>
            <p className="text-sm text-stone-300 leading-relaxed font-sans">
              In <strong className="text-amber-300">The Haunted Library Files</strong>, the horror arises not from Mexican culture, but from institutional censorship and bureaucratic erasure. The memory altar (ofrenda) is the beacon of healing, warmth, and justice.
            </p>
          </div>
        </div>
      </div>

      {/* Four Sacred Elements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Marigolds (Cempasúchil) */}
        <div className="bg-[#0e0e14] border border-stone-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/40 text-amber-400">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-cinzel text-base font-bold text-stone-100">
                Flor de Cempasúchil (Marigold)
              </h4>
              <span className="text-xs text-amber-500 font-cormorant italic">The Flower of Four Hundred Lives</span>
            </div>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            Known in Nahuatl as <em>Cempohualxochitl</em>, its brilliant golden color and rich aromatic scent are believed to illuminate a path in the twilight, guiding the spirits of loved ones safely back home to reunite with family.
          </p>
        </div>

        {/* Candles & Wax (Velas) */}
        <div className="bg-[#0e0e14] border border-stone-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/40 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-cinzel text-base font-bold text-stone-100">
                Las Velas (Candles)
              </h4>
              <span className="text-xs text-amber-500 font-cormorant italic">Light & Hope</span>
            </div>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            Candles represent the element of fire and faith. Each flickering taper signifies a soul welcomed back. In tradition, four candles are placed to symbolize the four cardinal points, orienting travelers on their journey.
          </p>
        </div>

        {/* Portraits & Heirlooms (Fotografías y Recuerdos) */}
        <div className="bg-[#0e0e14] border border-stone-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/40 text-amber-400">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-cinzel text-base font-bold text-stone-100">
                Fotografías y Objetos
              </h4>
              <span className="text-xs text-amber-500 font-cormorant italic">The Anchor of Identity</span>
            </div>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            Photographs of the deceased are traditionally placed at the highest tier of the ofrenda. Accompanied by objects they treasured—books, letters, watches—these items verify that their lived individuality remains sacred.
          </p>
        </div>

        {/* Offerings (Pan de Muerto & Water) */}
        <div className="bg-[#0e0e14] border border-stone-800 rounded-xl p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/40 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-cinzel text-base font-bold text-stone-100">
                Pan de Muerto y Ofrendas
              </h4>
              <span className="text-xs text-amber-500 font-cormorant italic">Nourishment for the Journey</span>
            </div>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed font-sans">
            Round sweet bread decorated with crossbones shapes, fresh water to quench thirst after the long road from Mictlán, and salt to purify the spirit. It is an act of generous hospitality from host to guest.
          </p>
        </div>
      </div>

      {/* Cultural Nuance Note */}
      <div className="bg-stone-950 border border-stone-800/80 rounded-xl p-5 text-xs text-stone-400 leading-relaxed font-sans flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-stone-200">Note on Diversity of Practice:</strong> Traditions vary richly across Mexican states (such as Oaxaca, Michoacán, and Mexico City) and diaspora communities worldwide. Some families observe altars for deceased children on November 1 (Día de los Inocentes) and adults on November 2; others celebrate throughout the entire week with music, storytelling, and cemetery vigils.
        </div>
      </div>
    </div>
  );
};
