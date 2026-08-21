export interface ICommentNode {
  id: string;
  parentId?: string | null;
  content: string;
  replies?: ICommentNode[];
}

export class NestedCommentsService {
  static buildCommentTree(comments: ICommentNode[]): ICommentNode[] {
    const map = new Map<string, ICommentNode>();
    const roots: ICommentNode[] = [];

    comments.forEach((c) => {
      map.set(c.id, { ...c, replies: [] });
    });

    comments.forEach((c) => {
      const node = map.get(c.id)!;
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)!.replies!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
}
