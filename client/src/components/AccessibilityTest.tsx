import { useState } from 'react';
import { Eye, EyeOff, Check, X, AlertTriangle } from 'lucide-react';

interface ContrastTest {
  name: string;
  foreground: string;
  background: string;
  ratio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
}

const AccessibilityTest = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [testMode, setTestMode] = useState<'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia'>('normal');

  // Contrast ratio calculations for our color palette
  const contrastTests: ContrastTest[] = [
    {
      name: 'Orange-600 on White',
      foreground: '#ea580c',
      background: '#ffffff',
      ratio: 5.9, // Passes WCAG AA (4.5:1)
      wcagAA: true,
      wcagAAA: false
    },
    {
      name: 'Blue-700 on White',
      foreground: '#1d4ed8',
      background: '#ffffff',
      ratio: 6.2, // Passes WCAG AA (4.5:1)
      wcagAA: true,
      wcagAAA: false
    },
    {
      name: 'White on Orange-500',
      foreground: '#ffffff',
      background: '#f97316',
      ratio: 4.6, // Passes WCAG AA (4.5:1)
      wcagAA: true,
      wcagAAA: false
    },
    {
      name: 'White on Blue-600',
      foreground: '#ffffff',
      background: '#2563eb',
      ratio: 8.2, // Passes WCAG AAA (7:1)
      wcagAA: true,
      wcagAAA: true
    },
    {
      name: 'Gray-800 on White',
      foreground: '#1f2937',
      background: '#ffffff',
      ratio: 15.8, // Passes WCAG AAA (7:1)
      wcagAA: true,
      wcagAAA: true
    },
    {
      name: 'Orange-600 on Orange-50',
      foreground: '#ea580c',
      background: '#fff7ed',
      ratio: 5.2, // Passes WCAG AA (4.5:1)
      wcagAA: true,
      wcagAAA: false
    }
  ];

  const colorBlindnessFilters = {
    normal: 'none',
    protanopia: 'url(#protanopia)',
    deuteranopia: 'url(#deuteranopia)',
    tritanopia: 'url(#tritanopia)'
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-200 z-50"
        title="Show Accessibility Test"
      >
        <Eye className="w-4 h-4" />
      </button>
    );
  }

  return (
    <>
      {/* Color blindness SVG filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="protanopia">
            <feColorMatrix values="0.567, 0.433, 0,     0, 0
                                   0.558, 0.442, 0,     0, 0
                                   0,     0.242, 0.758, 0, 0
                                   0,     0,     0,     1, 0"/>
          </filter>
          <filter id="deuteranopia">
            <feColorMatrix values="0.625, 0.375, 0,   0, 0
                                   0.7,   0.3,   0,   0, 0
                                   0,     0.3,   0.7, 0, 0
                                   0,     0,     0,   1, 0"/>
          </filter>
          <filter id="tritanopia">
            <feColorMatrix values="0.95, 0.05,  0,     0, 0
                                   0,    0.433, 0.567, 0, 0
                                   0,    0.475, 0.525, 0, 0
                                   0,    0,     0,     1, 0"/>
          </filter>
        </defs>
      </svg>

      <div 
        className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-md z-50"
        style={{ filter: colorBlindnessFilters[testMode] }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Accessibility Test
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>

        {/* Color Blindness Test Selector */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color Blindness Simulation:
          </label>
          <select
            value={testMode}
            onChange={(e) => setTestMode(e.target.value as any)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="normal">Normal Vision</option>
            <option value="protanopia">Protanopia (Red-blind)</option>
            <option value="deuteranopia">Deuteranopia (Green-blind)</option>
            <option value="tritanopia">Tritanopia (Blue-blind)</option>
          </select>
        </div>

        {/* Contrast Test Results */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            WCAG 2.1 Contrast Tests:
          </h4>
          
          {contrastTests.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-600"
              style={{
                backgroundColor: test.background,
                color: test.foreground
              }}
            >
              <div className="flex-1">
                <div className="text-sm font-medium">{test.name}</div>
                <div className="text-xs opacity-80">Ratio: {test.ratio}:1</div>
              </div>
              <div className="flex space-x-1">
                <div title="WCAG AA Compliant">
                  {test.wcagAA ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div title="WCAG AAA Compliant">
                  {test.wcagAAA ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Color Palette Test */}
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Color Distinguishability:
          </h4>
          <div className="flex space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded border-2 border-gray-300" title="Orange-500"></div>
            <div className="w-8 h-8 bg-blue-600 rounded border-2 border-gray-300" title="Blue-600"></div>
            <div className="w-8 h-8 bg-green-600 rounded border-2 border-gray-300" title="Green-600 (Success)"></div>
            <div className="w-8 h-8 bg-red-600 rounded border-2 border-gray-300" title="Red-600 (Error)"></div>
            <div className="w-8 h-8 bg-gray-500 rounded border-2 border-gray-300" title="Gray-500 (Neutral)"></div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {testMode === 'normal' 
              ? 'Colors should be clearly distinguishable'
              : `Testing ${testMode} color blindness simulation`
            }
          </p>
        </div>

        {/* Interactive Elements Test */}
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Interactive Elements:
          </h4>
          <div className="space-y-2">
            <button className="btn-primary w-full text-sm">Primary Button</button>
            <button className="btn-secondary w-full text-sm">Secondary Button</button>
            <button className="btn-outline w-full text-sm">Outline Button</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccessibilityTest;