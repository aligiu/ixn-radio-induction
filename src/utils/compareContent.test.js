import { 
    getAddedContent, 
    getDeletedContent, 
    getModifiedContent, 
    getRearrangedContent, 
    extractTitles 
  } from './compareContent';
  
  describe('compareContent utilities', () => {
    const originalContent = [
      { id: 1, title: 'Item 1', description: 'Desc 1', content: 'Content 1', secret: false, nextId: 2, prevId: null },
      { id: 2, title: 'Item 2', description: 'Desc 2', content: 'Content 2', secret: false, nextId: null, prevId: 1 },
    ];
  
    const editedContent = [
      { id: 1, title: 'Item 1', description: 'Desc 1 Modified', content: 'Content 1', secret: false, nextId: 2, prevId: null },
      { id: 3, title: 'Item 3', description: 'Desc 3', content: 'Content 3', secret: true, nextId: null, prevId: 2 },
    ];
  
    const fileOps = [
      { folderId: 1, operation: 'add' },
    ];
  
    test('getAddedContent should return newly added content', () => {
      const result = getAddedContent(editedContent, originalContent);
      expect(result).toEqual([{ id: 3, title: 'Item 3', description: 'Desc 3', content: 'Content 3', secret: true, nextId: null, prevId: 2 }]);
    });
  
    test('getDeletedContent should return deleted content', () => {
      const result = getDeletedContent(editedContent, originalContent);
      expect(result).toEqual([{ id: 2, title: 'Item 2', description: 'Desc 2', content: 'Content 2', secret: false, nextId: null, prevId: 1 }]);
    });
  
    test('getModifiedContent should return modified content', () => {
      const result = getModifiedContent(editedContent, originalContent, fileOps);
      expect(result).toEqual([{ id: 1, title: 'Item 1', description: 'Desc 1 Modified', content: 'Content 1', secret: false, nextId: 2, prevId: null }]);
    });
  
    test('getRearrangedContent should return rearranged content', () => {
      const rearrangedContent = [
        { id: 1, title: 'Item 1', description: 'Desc 1', content: 'Content 1', secret: false, nextId: null, prevId: null },
        { id: 2, title: 'Item 2', description: 'Desc 2', content: 'Content 2', secret: false, nextId: 1, prevId: null },
      ];
  
      const result = getRearrangedContent(rearrangedContent, originalContent);
      expect(result).toEqual([
        { id: 1, title: 'Item 1', description: 'Desc 1', content: 'Content 1', secret: false, nextId: null, prevId: null },
        { id: 2, title: 'Item 2', description: 'Desc 2', content: 'Content 2', secret: false, nextId: 1, prevId: null },
      ]);
    });
  
    test('extractTitles should return an array of titles', () => {
      const result = extractTitles(editedContent);
      expect(result).toEqual(['Item 1', 'Item 3']);
    });
  });