import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Bar} from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

export const options = {
  plugins: {
    title: {
      display: true,
    },
  },
  responsive: true,
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};

export const PendingTask = ({usersIssue}) => {
  const [labels, setLabels] = useState([]);
  const [todo, setTodo] = useState([]);
  const [inprogress, setInprogress] = useState([]);

  useEffect(() => {
    const issueData = [];
    usersIssue.forEach((issue) => {
      const index = issueData.findIndex((issue1, i) => {
        return issue1.assigneeId === issue.assigneeId;
      });
      if (index !== -1) {
        issueData[index][issue.assigne] += 1;
      } else {
        const issueList = {
          id: issue.id,
          assignee: issue.assignee,
          todo: issue.todo,
          inprogress: issue.inprogress,
          totalPending: issue.todo + issue.inprogress,
        };
        issueData.push(issueList);
      }
    });
    const topThree = issueData.sort((a, b) =>
      b.totalPending - a.totalPending).slice(0, 3);

    setLabels(topThree.map((issue) => issue.assignee));
    setTodo(topThree.map((issue) => issue.todo));
    setInprogress(topThree.map((issue) => issue.inprogress));
  }, [usersIssue]);

  const data = {
    labels,
    datasets: [
      {
        barThickness: 40,
        label: 'To-Do',
        backgroundColor: '#f2d245',
        data: todo,
      },
      {
        barThickness: 40,
        label: 'In-Progress',
        backgroundColor: '#2385ff',
        data: inprogress,
      },
    ],
  };
  return <Bar options={options} data={data} />;
};

PendingTask.propTypes = {
  usersIssue: PropTypes.any.isRequired,
};
