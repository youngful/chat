
export interface MessageRow {
  content: string
  created_at: string
  author: string
  users: any | {
		userName: string
	}
}
