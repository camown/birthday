import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, X, Save, Download, Upload, Lock, Unlock, Sparkles, Check } from 'lucide-react';
import { RecipientConfig } from '../types';
import { soundFx } from '../lib/audio';

interface CreatorModalProps {
  config: RecipientConfig;
  onSaveConfig: (newConfig: RecipientConfig) => void;
  onClose: () => void;
}

export const CreatorModal: React.FC<CreatorModalProps> = ({
  config,
  onSaveConfig,
  onClose,
}) => {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'letter' | 'riddles' | 'json'>('profile');

  const [formConfig, setFormConfig] = useState<RecipientConfig>(config);
  const [jsonText, setJsonText] = useState(JSON.stringify(config, null, 2));
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === config.secretPasscode || passcode === '1234') {
      setIsUnlocked(true);
      soundFx.playUnlock();
    } else {
      soundFx.playPop();
      alert('Incorrect creator passcode! Default passcode is: 1234');
    }
  };

  const handleSave = () => {
    onSaveConfig(formConfig);
    soundFx.playFanfare();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1200);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setFormConfig(parsed);
      onSaveConfig(parsed);
      soundFx.playUnlock();
      alert('Config JSON successfully imported!');
    } catch {
      alert('Invalid JSON formatting!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-white relative"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Personalize Surprise Experience</h3>
              <span className="text-xs text-rose-300/80">Customize names, letter, media, and treasure riddles</span>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock Screen if Passcode required */}
        {!isUnlocked ? (
          <div className="p-8 text-center flex flex-col items-center justify-center my-auto">
            <Lock className="w-12 h-12 text-amber-300 mb-4" />
            <h4 className="text-xl font-bold mb-2">Creator Customizer Mode</h4>
            <p className="text-slate-300 text-xs mb-6 max-w-sm">
              Enter passcode to edit the birthday recipient's profile and media. (Default passcode: <code className="bg-slate-800 px-2 py-1 rounded text-amber-300">1234</code>)
            </p>

            <form onSubmit={handleUnlock} className="flex gap-2 max-w-xs w-full">
              <input
                type="password"
                placeholder="Passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-center text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
              <button
                type="submit"
                className="px-5 py-3 rounded-xl bg-rose-500 font-bold text-xs text-white"
              >
                Unlock
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Nav Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 px-6 py-2 bg-slate-950/40">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                  activeTab === 'profile' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Recipient Profile
              </button>
              <button
                onClick={() => setActiveTab('letter')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                  activeTab === 'letter' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Birthday Letter
              </button>
              <button
                onClick={() => setActiveTab('riddles')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                  activeTab === 'riddles' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Treasure Riddles
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold ${
                  activeTab === 'json' ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Import / Export
              </button>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Recipient First Name
                      </label>
                      <input
                        type="text"
                        value={formConfig.recipientName}
                        onChange={(e) => setFormConfig({ ...formConfig, recipientName: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nickname
                      </label>
                      <input
                        type="text"
                        value={formConfig.nickname}
                        onChange={(e) => setFormConfig({ ...formConfig, nickname: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Turning Age
                      </label>
                      <input
                        type="number"
                        value={formConfig.turningAge}
                        onChange={(e) => setFormConfig({ ...formConfig, turningAge: Number(e.target.value) })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Birth Date String
                      </label>
                      <input
                        type="text"
                        value={formConfig.birthDate}
                        onChange={(e) => setFormConfig({ ...formConfig, birthDate: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Headline Banner Text
                    </label>
                    <input
                      type="text"
                      value={formConfig.headline}
                      onChange={(e) => setFormConfig({ ...formConfig, headline: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'letter' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Main Birthday Letter
                  </label>
                  <textarea
                    rows={8}
                    value={formConfig.letterMessage}
                    onChange={(e) => setFormConfig({ ...formConfig, letterMessage: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white font-sans leading-relaxed"
                  />
                </div>
              )}

              {activeTab === 'riddles' && (
                <div className="space-y-4">
                  {formConfig.treasureStages.map((stage, idx) => (
                    <div key={stage.id} className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-2">
                      <h5 className="font-bold text-xs text-amber-300">Level {stage.id}: {stage.title}</h5>
                      <div>
                        <label className="block text-[10px] text-slate-400">Riddle Question</label>
                        <input
                          type="text"
                          value={stage.riddle}
                          onChange={(e) => {
                            const updated = [...formConfig.treasureStages];
                            updated[idx].riddle = e.target.value;
                            setFormConfig({ ...formConfig, treasureStages: updated });
                          }}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-slate-400">Answer Password</label>
                          <input
                            type="text"
                            value={stage.answer}
                            onChange={(e) => {
                              const updated = [...formConfig.treasureStages];
                              updated[idx].answer = e.target.value;
                              setFormConfig({ ...formConfig, treasureStages: updated });
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-slate-400">Hint</label>
                          <input
                            type="text"
                            value={stage.hint}
                            onChange={(e) => {
                              const updated = [...formConfig.treasureStages];
                              updated[idx].hint = e.target.value;
                              setFormConfig({ ...formConfig, treasureStages: updated });
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'json' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-300">
                    Copy or edit the complete JSON config to back up or share across devices.
                  </p>
                  <textarea
                    rows={8}
                    value={jsonText}
                    onChange={(e) => setJsonText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-emerald-400 font-mono"
                  />
                  <button
                    onClick={handleImportJson}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
                  >
                    Import & Apply JSON
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {saveSuccess ? '✨ Customization Saved!' : 'Changes update instantly in local memory.'}
              </span>

              <button
                onClick={handleSave}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/25"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
