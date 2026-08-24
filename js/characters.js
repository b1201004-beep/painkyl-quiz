const SKIN = '#F6D7C4';
const SKIN2 = '#F0C4A8';

function heart(cx, cy, s, color) {
  return `<path d="M${cx} ${cy + s * 0.9} C${cx - s} ${cy} ${cx - s * 0.8} ${cy - s} ${cx} ${cy - s * 0.3} C${cx + s * 0.8} ${cy - s} ${cx + s} ${cy} ${cx} ${cy + s * 0.9} Z" fill="${color}"/>`;
}

function svgWrap(inner) {
  return `<svg viewBox="0 0 200 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">${inner}</svg>`;
}

const assessor = svgWrap(`
  <circle cx="100" cy="128" r="90" fill="#E3F2EA"/>
  <rect x="30" y="58" width="6" height="16" rx="3" fill="#9CCDB6"/>
  <rect x="40" y="50" width="6" height="24" rx="3" fill="#7FB89F"/>
  <rect x="50" y="64" width="6" height="10" rx="3" fill="#BFDCCF"/>
  <path d="M164 54 h4 v-4 h8 v4 h4 v8 h-4 v4 h-8 v-4 h-4 Z" fill="#9CCDB6"/>
  <circle cx="160" cy="182" r="13" fill="none" stroke="#BFDCCF" stroke-width="2.5" stroke-dasharray="4 5"/>
  <ellipse cx="100" cy="242" rx="42" ry="6" fill="rgba(45,106,79,0.07)"/>
  <circle cx="100" cy="44" r="13" fill="#4A3728"/>
  <rect x="93" y="98" width="14" height="12" fill="${SKIN}"/>
  <path d="M73 116 Q100 105 127 116 L133 198 Q100 205 67 198 Z" fill="#FFFFFF" stroke="#DCE7E1" stroke-width="2"/>
  <path d="M88 113 L100 135 L112 113 Z" fill="#2D6A4F"/>
  <circle cx="100" cy="148" r="2" fill="#B9CFC4"/>
  <circle cx="100" cy="160" r="2" fill="#B9CFC4"/>
  <circle cx="100" cy="172" r="2" fill="#B9CFC4"/>
  <path d="M85 114 C85 138 92 147 100 150 C108 147 115 138 115 114" fill="none" stroke="#3E4C59" stroke-width="3" stroke-linecap="round"/>
  <circle cx="100" cy="155" r="5.5" fill="#3E4C59"/>
  <path d="M73 118 C63 132 61 152 68 166 L80 161 C75 148 77 134 84 122 Z" fill="#FFFFFF" stroke="#DCE7E1" stroke-width="2"/>
  <path d="M127 118 C137 128 139 142 133 154 L121 148 C125 139 123 130 117 122 Z" fill="#FFFFFF" stroke="#DCE7E1" stroke-width="2"/>
  <g transform="rotate(-6 128 168)">
    <rect x="112" y="146" width="34" height="46" rx="5" fill="#FFFFFF" stroke="#2D6A4F" stroke-width="2.5"/>
    <rect x="124" y="141" width="10" height="8" rx="2" fill="#2D6A4F"/>
    <line x1="118" y1="158" x2="140" y2="158" stroke="#9CCDB6" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="118" y1="166" x2="136" y2="166" stroke="#9CCDB6" stroke-width="2.5" stroke-linecap="round"/>
    <line x1="118" y1="174" x2="139" y2="174" stroke="#9CCDB6" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M118 157 l3 3 l5 -6" fill="none" stroke="#2D6A4F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <circle cx="129" cy="152" r="7" fill="${SKIN}"/>
  <circle cx="74" cy="169" r="7" fill="${SKIN}"/>
  <ellipse cx="100" cy="76" rx="25" ry="27" fill="${SKIN}"/>
  <ellipse cx="75" cy="80" rx="4" ry="5" fill="${SKIN}"/>
  <ellipse cx="125" cy="80" rx="4" ry="5" fill="${SKIN}"/>
  <path d="M75 72 C75 46 85 40 100 40 C115 40 125 46 125 72 C119 56 110 52 100 52 C90 52 81 56 75 72 Z" fill="#4A3728"/>
  <path d="M83 68 Q89 65 95 68" fill="none" stroke="#4A3728" stroke-width="2" stroke-linecap="round"/>
  <path d="M105 68 Q111 65 117 68" fill="none" stroke="#4A3728" stroke-width="2" stroke-linecap="round"/>
  <circle cx="89" cy="78" r="9" fill="rgba(255,255,255,0.55)" stroke="#2D6A4F" stroke-width="2.5"/>
  <circle cx="111" cy="78" r="9" fill="rgba(255,255,255,0.55)" stroke="#2D6A4F" stroke-width="2.5"/>
  <line x1="98" y1="78" x2="102" y2="78" stroke="#2D6A4F" stroke-width="2.5"/>
  <line x1="80" y1="78" x2="75" y2="79" stroke="#2D6A4F" stroke-width="2.5"/>
  <line x1="120" y1="78" x2="125" y2="79" stroke="#2D6A4F" stroke-width="2.5"/>
  <circle cx="89" cy="79" r="2.6" fill="#35353F"/>
  <circle cx="111" cy="79" r="2.6" fill="#35353F"/>
  <path d="M94 92 Q100 97 107 92" fill="none" stroke="#C4876B" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="80" cy="89" rx="4" ry="2.5" fill="#F3B8A6" opacity="0.55"/>
  <ellipse cx="120" cy="89" rx="4" ry="2.5" fill="#F3B8A6" opacity="0.55"/>
  <rect x="83" y="198" width="13" height="36" rx="5" fill="#33475B"/>
  <rect x="104" y="198" width="13" height="36" rx="5" fill="#33475B"/>
  <path d="M79 234 h19 v6 q0 5 -6 5 h-13 q-5 0 -5 -6 Z" fill="#2D6A4F"/>
  <path d="M102 234 h19 v6 q0 5 -6 5 h-13 q-5 0 -5 -6 Z" fill="#2D6A4F"/>
`);

const advocate = svgWrap(`
  <circle cx="100" cy="128" r="90" fill="#FBEAE2"/>
  <rect x="22" y="96" width="26" height="5" rx="2.5" fill="#F0B49E"/>
  <rect x="16" y="112" width="20" height="5" rx="2.5" fill="#F0B49E" opacity="0.7"/>
  <rect x="26" y="128" width="16" height="5" rx="2.5" fill="#F0B49E" opacity="0.5"/>
  <circle cx="162" cy="58" r="12" fill="#FFFFFF" stroke="#C75B39" stroke-width="3"/>
  <rect x="159" y="42" width="6" height="6" rx="2" fill="#C75B39"/>
  <path d="M162 58 L162 51 M162 58 L167 61" stroke="#C75B39" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="100" cy="242" rx="44" ry="6" fill="rgba(199,91,57,0.08)"/>
  <rect x="93" y="99" width="14" height="11" fill="${SKIN2}"/>
  <path d="M72 116 Q100 106 128 116 L132 192 Q100 199 68 192 Z" fill="#C75B39" stroke="#B04E31" stroke-width="2"/>
  <path d="M88 113 L100 131 L112 113 Z" fill="#F6EFE9"/>
  <rect x="114" y="132" width="16" height="14" rx="3" fill="#FFFFFF" stroke="#B04E31" stroke-width="2"/>
  <rect x="117" y="137" width="10" height="4" fill="#C75B39"/>
  <rect x="120" y="134" width="4" height="10" fill="#C75B39"/>
  <path d="M126 118 C140 112 148 100 150 88 L138 82 C134 92 128 100 118 106 Z" fill="#C75B39" stroke="#B04E31" stroke-width="2"/>
  <circle cx="145" cy="84" r="8" fill="${SKIN2}"/>
  <path d="M74 118 C64 128 60 142 64 156 L76 151 C73 141 76 130 84 122 Z" fill="#C75B39" stroke="#B04E31" stroke-width="2"/>
  <circle cx="69" cy="158" r="7" fill="${SKIN2}"/>
  <path d="M84 192 L98 192 L94 232 L78 232 Z" fill="#3E4C59"/>
  <path d="M104 192 L118 192 L124 228 L108 230 Z" fill="#3E4C59"/>
  <path d="M74 232 h22 v6 q0 5 -6 5 h-16 q-5 0 -5 -6 Z" fill="#F6EFE9" stroke="#D8CCC0" stroke-width="1.5"/>
  <path d="M106 228 l20 -4 l2 6 q1 5 -5 6 l-15 3 q-5 1 -6 -5 Z" fill="#F6EFE9" stroke="#D8CCC0" stroke-width="1.5"/>
  <ellipse cx="100" cy="76" rx="25" ry="27" fill="${SKIN2}"/>
  <path d="M76 66 C76 44 88 38 100 38 C112 38 124 44 124 66 L118 57 C114 49 106 46 100 46 C94 46 86 49 82 57 Z" fill="#2E2A26"/>
  <path d="M82 66 L96 69" stroke="#2E2A26" stroke-width="3" stroke-linecap="round"/>
  <path d="M118 66 L104 69" stroke="#2E2A26" stroke-width="3" stroke-linecap="round"/>
  <circle cx="89" cy="78" r="2.8" fill="#35353F"/>
  <circle cx="111" cy="78" r="2.8" fill="#35353F"/>
  <path d="M92 90 A8 8 0 0 0 108 90 Z" fill="#7E4632"/>
`);

const companion = svgWrap(`
  <circle cx="100" cy="128" r="90" fill="#FAECF3"/>
  ${heart(38, 66, 7, '#E8A7C5')}
  ${heart(163, 92, 5, '#E8A7C5')}
  ${heart(156, 168, 6, '#F0BCD3')}
  <path d="M30 176 h8 M34 172 v8" stroke="#E8A7C5" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="100" cy="242" rx="42" ry="6" fill="rgba(176,87,141,0.07)"/>
  <path d="M72 76 C72 44 128 44 128 76 L130 114 Q100 126 70 114 Z" fill="#6B4A3A"/>
  <rect x="93" y="98" width="14" height="11" fill="${SKIN}"/>
  <path d="M71 118 Q100 107 129 118 L136 178 Q100 189 64 178 Z" fill="#F7D9E7" stroke="#EBC2D6" stroke-width="2"/>
  <path d="M88 114 L100 130 L112 114 Z" fill="#FFFFFF"/>
  <circle cx="100" cy="142" r="2" fill="#D89AB8"/>
  <circle cx="100" cy="154" r="2" fill="#D89AB8"/>
  <rect x="68" y="170" width="64" height="8" rx="4" fill="#E8A7C5"/>
  <path d="M73 120 C66 134 68 148 78 156 L88 147 C82 140 81 130 85 122 Z" fill="#F7D9E7" stroke="#EBC2D6" stroke-width="2"/>
  <path d="M127 120 C134 134 132 148 122 156 L112 147 C118 140 119 130 115 122 Z" fill="#F7D9E7" stroke="#EBC2D6" stroke-width="2"/>
  ${heart(100, 146, 11, '#E06A9A')}
  <circle cx="92" cy="158" r="7" fill="${SKIN}"/>
  <circle cx="108" cy="158" r="7" fill="${SKIN}"/>
  <rect x="84" y="178" width="12" height="28" rx="5" fill="${SKIN}"/>
  <rect x="104" y="178" width="12" height="28" rx="5" fill="${SKIN}"/>
  <rect x="84" y="200" width="12" height="8" fill="#FFFFFF"/>
  <rect x="104" y="200" width="12" height="8" fill="#FFFFFF"/>
  <path d="M80 234 h18 v6 q0 5 -6 5 h-12 q-5 0 -5 -5 Z" fill="#B0578D"/>
  <path d="M102 234 h18 v6 q0 5 -6 5 h-12 q-5 0 -5 -5 Z" fill="#B0578D"/>
  <ellipse cx="100" cy="76" rx="25" ry="27" fill="${SKIN}"/>
  <path d="M75 72 C75 46 85 40 100 40 C115 40 125 46 125 72 C118 58 112 54 100 54 C88 54 82 58 75 72 Z" fill="#6B4A3A"/>
  <path d="M84 44 L116 44 L112 29 Q100 23 88 29 Z" fill="#FFFFFF" stroke="#E5CBD9" stroke-width="1.5"/>
  <rect x="96" y="32.8" width="8" height="2.6" fill="#B0578D"/>
  <rect x="98.7" y="30" width="2.6" height="8" fill="#B0578D"/>
  <path d="M83 67 Q89 64 95 67" fill="none" stroke="#6B4A3A" stroke-width="2" stroke-linecap="round"/>
  <path d="M105 67 Q111 64 117 67" fill="none" stroke="#6B4A3A" stroke-width="2" stroke-linecap="round"/>
  <path d="M84 78 Q89 73 94 78" fill="none" stroke="#35353F" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M106 78 Q111 73 116 78" fill="none" stroke="#35353F" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M93 89 Q100 97 107 89 Q100 92 93 89 Z" fill="#A05A48"/>
  <ellipse cx="81" cy="87" rx="4.5" ry="3" fill="#F2AE9E" opacity="0.7"/>
  <ellipse cx="119" cy="87" rx="4.5" ry="3" fill="#F2AE9E" opacity="0.7"/>
`);

const integrator = svgWrap(`
  <circle cx="100" cy="128" r="90" fill="#EAF1F9"/>
  <circle cx="100" cy="122" r="80" fill="none" stroke="#A9C4E4" stroke-width="2" stroke-dasharray="5 7" opacity="0.7"/>
  <circle cx="24" cy="122" r="6" fill="#4A6FA5"/><circle cx="24" cy="122" r="2" fill="#FFFFFF"/>
  <circle cx="176" cy="122" r="6" fill="#4A6FA5"/><circle cx="176" cy="122" r="2" fill="#FFFFFF"/>
  <circle cx="100" cy="36" r="6" fill="#4A6FA5"/><circle cx="100" cy="36" r="2" fill="#FFFFFF"/>
  <ellipse cx="100" cy="242" rx="42" ry="6" fill="rgba(74,111,165,0.07)"/>
  <rect x="93" y="98" width="14" height="11" fill="${SKIN2}"/>
  <path d="M76 114 Q100 106 124 114 L127 196 Q100 202 73 196 Z" fill="#FFFFFF" stroke="#D9E2EC" stroke-width="2"/>
  <path d="M76 114 C68 122 66 152 70 196 L85 196 L87 130 Z" fill="#4A6FA5" stroke="#3D5E8C" stroke-width="2"/>
  <path d="M124 114 C132 122 134 152 130 196 L115 196 L113 130 Z" fill="#4A6FA5" stroke="#3D5E8C" stroke-width="2"/>
  <path d="M88 112 L100 126 L112 112 L112 119 L100 133 L88 119 Z" fill="#D9E2EC"/>
  <path d="M92 114 L98 140 M108 114 L102 140" stroke="#2F3B4C" stroke-width="2.5"/>
  <rect x="92" y="140" width="16" height="20" rx="3" fill="#FFFFFF" stroke="#2F3B4C" stroke-width="2"/>
  <rect x="95" y="143" width="10" height="8" fill="#A9C4E4"/>
  <line x1="95" y1="155" x2="105" y2="155" stroke="#C9D6E6" stroke-width="2"/>
  <line x1="95" y1="158" x2="103" y2="158" stroke="#C9D6E6" stroke-width="2"/>
  <path d="M78 118 C70 132 72 148 82 158 L92 150 C86 142 85 130 90 122 Z" fill="#4A6FA5" stroke="#3D5E8C" stroke-width="2"/>
  <path d="M122 118 C130 132 128 148 118 158 L108 150 C114 142 115 130 110 122 Z" fill="#4A6FA5" stroke="#3D5E8C" stroke-width="2"/>
  <g transform="rotate(-4 100 160)">
    <rect x="78" y="142" width="44" height="34" rx="4" fill="#23272E"/>
    <rect x="81" y="145" width="38" height="28" rx="2" fill="#EAF1F9"/>
    <polyline points="85,168 93,160 99,164 107,152 115,156" fill="none" stroke="#4A6FA5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="93" cy="160" r="2" fill="#4A6FA5"/>
    <circle cx="107" cy="152" r="2" fill="#4A6FA5"/>
  </g>
  <circle cx="84" cy="161" r="7" fill="${SKIN2}"/>
  <circle cx="116" cy="161" r="7" fill="${SKIN2}"/>
  <ellipse cx="100" cy="76" rx="25" ry="27" fill="${SKIN2}"/>
  <path d="M75 70 C75 44 86 39 100 39 C114 39 125 44 125 70 C120 56 112 51 104 52 L98 58 C90 54 82 60 75 70 Z" fill="#23272E"/>
  <path d="M83 67 L95 67" stroke="#23272E" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M105 67 L117 67" stroke="#23272E" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="89" cy="78" r="2.7" fill="#35353F"/>
  <circle cx="111" cy="78" r="2.7" fill="#35353F"/>
  <path d="M93 91 Q100 96 108 90" fill="none" stroke="#B07B5D" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="83" y="196" width="13" height="34" rx="5" fill="#2F3B4C"/>
  <rect x="104" y="196" width="13" height="34" rx="5" fill="#2F3B4C"/>
  <path d="M79 230 h19 v6 q0 5 -6 5 h-13 q-5 0 -5 -6 Z" fill="#23272E"/>
  <path d="M102 230 h19 v6 q0 5 -6 5 h-13 q-5 0 -5 -6 Z" fill="#23272E"/>
`);

export const characters = { assessor, advocate, companion, integrator };
