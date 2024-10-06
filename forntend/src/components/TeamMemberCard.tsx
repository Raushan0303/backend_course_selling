import React from 'react';
import Image from 'next/image';

interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  html_url: string;
}

interface TeamMemberCardProps {
  member: GitHubUser;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105">
      <div className="p-4">
        <Image
          src={member.avatar_url}
          alt={member.name || member.login}
          width={100}
          height={100}
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white text-center mb-2">
          {member.name || member.login}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-4">
          {member.bio || `GitHub user ${member.login}`}
        </p>
        <div className="text-center">
          <a
            href={member.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            GitHub Profile
          </a>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;