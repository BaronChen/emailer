import { expect } from 'chai';
import { Request } from 'express';
import { notEmptyAndIsUniqueAcrossArrays } from './validationHelper';

describe('validationHelper', () => {
  describe('notEmptyAndIsUniqueAcrossArrays', () => {
    it('should return true when no duplication presents and not empty array', () => {
      const validator = notEmptyAndIsUniqueAcrossArrays(['cc', 'bcc']);
      const request = {
        body: {
          to: ['1@1.com', '4@4.com'],
          cc: ['2@2.com'],
          bcc: ['3@3.com']
        }
      };

      const input: { req: Request; location: string; path: string } = {
        req: request as Request,
        location: '',
        path: ''
      };

      expect(validator(request.body.to, input)).to.equal(true);
    });

    it('should return true when no duplication within array and other array not exists', () => {
      const validator = notEmptyAndIsUniqueAcrossArrays(['cc', 'bcc']);
      const request = {
        body: {
          to: ['1@1.com', '2@2.com']
        }
      };

      const input: { req: Request; location: string; path: string } = {
        req: request as Request,
        location: '',
        path: ''
      };

      expect(validator(request.body.to, input)).to.equal(true);
    });

    it('should only check uniqueness with fields in input', () => {
      const validator = notEmptyAndIsUniqueAcrossArrays(['bcc']);
      const request = {
        body: {
          to: ['1@1.com'],
          cc: ['1@1.com'],
          bcc: []
        }
      };
      const input: { req: Request; location: string; path: string } = {
        req: request as Request,
        location: '',
        path: ''
      };
      expect(validator(request.body.to, input)).to.equal(true);
    });

    it('should return false when array is empty', () => {
      const validator = notEmptyAndIsUniqueAcrossArrays(['cc', 'bcc']);
      const request = {
        body: {
          to: [],
          cc: ['1@1.com'],
          bcc: []
        }
      };

      const input: { req: Request; location: string; path: string } = {
        req: request as Request,
        location: '',
        path: ''
      };

      expect(validator(request.body.to, input)).to.equal(false);
    });

    it('should return false when array is empty and other array not exists', () => {
      const validator = notEmptyAndIsUniqueAcrossArrays(['cc', 'bcc']);
      const request = {
        body: {
          to: []
        }
      };

      const input: { req: Request; location: string; path: string } = {
        req: request as Request,
        location: '',
        path: ''
      };

      expect(validator(request.body.to, input)).to.equal(false);
    });

    it('should return false when duplicated across arrays', () => {
      const validator = notEmptyAndIsUniqueAcrossArrays(['cc', 'bcc']);
      const request = {
        body: {
          to: ['1@1.com'],
          cc: ['1@1.com'],
          bcc: ['2@2.com']
        }
      };

      const input: { req: Request; location: string; path: string } = {
        req: request as Request,
        location: '',
        path: ''
      };

      expect(validator(request.body.to, input)).to.equal(false);
    });

    it('should return false when duplicated within array', () => {
      const validator = notEmptyAndIsUniqueAcrossArrays(['bcc']);
      const request = {
        body: {
          to: ['1@1.com', '1@1.com'],
          bcc: ['2@2.com']
        }
      };

      const input: { req: Request; location: string; path: string } = {
        req: request as Request,
        location: '',
        path: ''
      };

      expect(validator(request.body.to, input)).to.equal(false);
    });

    it('should return false when duplicate within array and other array not exists', () => {
      const validator = notEmptyAndIsUniqueAcrossArrays(['cc', 'bcc']);
      const request = {
        body: {
          to: ['1@1.com', '1@1.com']
        }
      };

      const input: { req: Request; location: string; path: string } = {
        req: request as Request,
        location: '',
        path: ''
      };

      expect(validator(request.body.to, input)).to.equal(false);
    });

    it('should return false when field is not an array', () => {
      const validator = notEmptyAndIsUniqueAcrossArrays([]);
      const request = {
        body: {
          to: null
        }
      };

      const input: { req: Request; location: string; path: string } = {
        req: request as Request,
        location: '',
        path: ''
      };

      expect(validator(request.body.to, input)).to.equal(false);
    });
  });
});
