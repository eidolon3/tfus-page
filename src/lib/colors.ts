import * as THREE from 'three'

export const COLORS = {
  bgPrimary: '#0A0A0F',
  bgSecondary: '#121218',
  bgCard: '#1A1A24',
  purpleBeam: '#BF40BF',
  purpleDeep: '#2D1B4E',
  purpleDarker: '#1A0A2E',
  purpleMid: '#6B2FA0',
  cyanSpark: '#00FFFF',
  skull: '#3A2A5C',
  skullGlow: '#5A3A8C',
  grid: '#1A1A2E',
  white: '#FFFFFF',
  textPrimary: '#E0E0E0',
  textSecondary: '#9CA3AF',
} as const

export const THREE_COLORS = {
  bgPrimary: new THREE.Color(COLORS.bgPrimary),
  purpleBeam: new THREE.Color(COLORS.purpleBeam),
  purpleDeep: new THREE.Color(COLORS.purpleDeep),
  purpleDarker: new THREE.Color(COLORS.purpleDarker),
  purpleMid: new THREE.Color(COLORS.purpleMid),
  cyanSpark: new THREE.Color(COLORS.cyanSpark),
  skull: new THREE.Color(COLORS.skull),
  skullGlow: new THREE.Color(COLORS.skullGlow),
  white: new THREE.Color(COLORS.white),
} as const
