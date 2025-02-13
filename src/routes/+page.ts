import type { PageLoad } from "./$types";

export const load: PageLoad = async () => {
  return {
    board: {
      id: 1,
      title: 'My board',
      sections: [
        {
          id: 1,
          title: 'Pending',
          tickets: [
            {
              id: 1,
              title: 'Task 1',
            },
            {
              id: 2,
              title: 'Task 2',
              height: 40
            },
            {
              id: 3,
              title: 'Task 3',
            },
            {
              id: 4,
              title: 'Task 4',
            },
          ],
        },
        {
          id: 2,
          title: 'In Progress',
          tickets: [
            {
              id: 5,
              title: 'Task 5',
            },
            {
              id: 6,
              title: 'Task 6',
            },
          ],
        },
        {
          id: 3,
          title: 'In Review',
          tickets: [
            {
              id: 7,
              title: 'Task 7',
            },
            {
              id: 8,
              title: 'Task 8',
            },
            {
              id: 9,
              title: 'Task 9',
            },
          ],
        },
        {
          id: 4,
          title: 'Blocked',
          tickets: [],
        },
        {
          id: 5,
          title: 'Done',
          tickets: [
            {
              id: 10,
              title: 'Task 10',
            },
          ],
        },
      ],
    },
  };
};
