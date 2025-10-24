export interface Profile {
  id: string;
  nickname: string | null;
  bio?: string | null;
  email?: string | null;
}

export interface Follow {
  follower_id: string;
  following_id: string;
}

export interface Notification {
  id: string;
  type: 'follow';
  from_user_id: string;
  from_user_nickname: string;
  to_user_id: string;
  read: boolean;
  created_at: string;
}