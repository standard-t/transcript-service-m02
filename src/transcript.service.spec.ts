import { beforeEach, describe, expect, it } from 'vitest';
import { TranscriptDB, type TranscriptService } from './transcript.service.ts';
import type { Course, CourseGrade, Student, Transcript } from './types.ts';

let db: TranscriptService;
beforeEach(() => {
  db = new TranscriptDB();
});

describe('addStudent', () => {
  it('should add a student to the database and return their id', () => {
    expect(db.nameToIDs('blair')).toStrictEqual([]);
    const id1 = db.addStudent('blair');
    expect(db.nameToIDs('blair')).toStrictEqual([id1]);
  });

  it('should return an ID distinct from any ID in the database', () => {
    // we'll add 3 students and check to see that their IDs are all different.
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('corey');
    const id3 = db.addStudent('del');
    expect(id1).not.toEqual(id2);
    expect(id1).not.toEqual(id3);
    expect(id2).not.toEqual(id3);
  });

  it('should permit adding a student w/ same name as an existing student', () => {
    const id1 = db.addStudent('blair');
    const id2 = db.addStudent('blair');
    expect(id1).not.toEqual(id2);
  });
});

describe('addGrade', () => {
  it('should throw an error if the given student does not exist', () => {
    // assemble 
    const psych: Course = 'Psychology';
    const psychGrade: CourseGrade = { course: psych, grade: 95 };
    // act and assert
    expect(() => db.addGrade(1, psych, psychGrade)).toThrowError();
  });


  it('should add a courseGrade to the database for the given student and course', () => {
    // assemble 
    const biology: Course = 'Biology';
    const bioGrade: CourseGrade = { course: biology, grade: 88 };
    const id1 = db.addStudent('Ruby');

    // act
    db.addGrade(id1, biology, bioGrade);

    // assert
    expect(db.getGrade(id1, biology)).toStrictEqual(bioGrade);
  });

  it('should overwrite an existing grade for the given student and course', () => {
    // assemble 
    const chemistry: Course = 'Chemistry';
    const chemGrade1: CourseGrade = { course: chemistry, grade: 65 };
    const chemGrade2: CourseGrade = { course: chemistry, grade: 85 };
    const id2 = db.addStudent('Sam');

    // act
    db.addGrade(id2, chemistry, chemGrade1);
    db.addGrade(id2, chemistry, chemGrade2);

    // assert
    expect(db.getGrade(id2, chemistry)).toStrictEqual(chemGrade2);
  });

  it('should add the new CourseGrade to the corresponding students transcript', () => {
    // assemble 
    const history: Course = 'History';
    const historyGrade: CourseGrade = { course: history, grade: 99 };
    const id3 = db.addStudent('Leah');
    const leah: Student = { studentID: id3, studentName: 'Leah' };
    const leahTranscript: Transcript = { student: leah, grades: [historyGrade] }
    // act 
    db.addGrade(id3, history, historyGrade);
    // assess 
    expect(db.getTranscript(id3)).toStrictEqual(leahTranscript);
  })



});

describe('getTranscript', () => {
  it('given the ID of a student, should return the student’s transcript', () => {
    const id1 = db.addStudent('blair');
    expect(db.getTranscript(id1)).not.toBeNull();
  });

  it('given the ID that is not the ID of any student, should throw an error', () => {
    // in an empty database, all IDs are bad :)
    // Note: the expression you expect to throw
    // must be wrapped in a (() => ...)
    expect(() => db.getTranscript(1)).toThrowError();
  });
});
