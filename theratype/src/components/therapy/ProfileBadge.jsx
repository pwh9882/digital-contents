import { therapySentences } from '../../data/therapySentences';

const ProfileBadge = ({ profileKey }) => {
  const profile = therapySentences[profileKey];

  if (!profile) {
    return null;
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2"
         style={{ borderColor: profile.color, backgroundColor: `${profile.color}20` }}>
      <span className="text-2xl">{profile.icon}</span>
      <div className="text-left">
        <div className="font-bold text-sm" style={{ color: profile.color }}>
          {profile.profileName}
        </div>
        <div className="text-xs text-neutral-600">
          {profile.profileDescription}
        </div>
      </div>
    </div>
  );
};

export default ProfileBadge;
