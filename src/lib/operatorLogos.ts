// Operator logos mapping
import teliaLogo from 'figma:asset/ce0a2006d87f7c1529ac30e56f68688615ca9f39.png';
import tele2Logo from 'figma:asset/1a1fe988b4651c69a493190ac0b03fde48beb0c8.png';
import treLogo from 'figma:asset/1b45252930a669628a1947c65c3a3e0a2591c211.png';
import chiliLogo from 'figma:asset/65aed23f256df22735c2b018019ce18a8b45b2b8.png';
import hallonLogo from 'figma:asset/a143c0ae691a800988c18123175f7c3e3c6b2fbf.png';
import comviqLogo from 'figma:asset/3a541e113b372a9f1322bd3517f3bcfcc97ec900.png';
import felloLogo from 'figma:asset/c0854ed0234b1fafe2df8f33ad9296fb79655c81.png';
import telenorLogo from 'figma:asset/31c159c7c8dbcb71501605e1d2d7d24a3d085ec4.png';
import vimlaLogo from 'figma:asset/916c41079d2d8f2c2a70ad2398ac7eb115a73dc1.png';

export const operatorLogos: Record<string, string> = {
  telia: teliaLogo,
  tele2: tele2Logo,
  tre: treLogo,
  '3': treLogo, // Alternative name for Tre
  chili: chiliLogo,
  'chili mobil': chiliLogo,
  hallon: hallonLogo,
  comviq: comviqLogo,
  fello: felloLogo,
  telenor: telenorLogo,
  vimla: vimlaLogo,
};

export function getOperatorLogo(operatorName: string): string | undefined {
  const normalized = operatorName.toLowerCase().trim();
  return operatorLogos[normalized];
}
