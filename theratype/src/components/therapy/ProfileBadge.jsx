import { therapySentences } from '../../data/therapySentences';

const ProfileBadge = ({ profileKey }) => {
  const profile = therapySentences[profileKey];

  if (!profile) {
    return null;
  }

  return (
    <div
      className="inline-flex items-center gap-3 px-4 py-2 rounded-full border bg-white shadow-sm transition-transform hover:scale-105"
      style={{ borderColor: `${profile.color}40` }}
    >
      <span className="text-xl filter drop-shadow-sm">{profile.icon}</span>
      <div className="flex flex-col">
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: profile.color }}>
          Current Focus
        </span>
        <span className="text-sm font-medium text-neutral-700">
          {profile.profileName}
        </span>
      </div>
    </div>
  );
};

export default ProfileBadge;
