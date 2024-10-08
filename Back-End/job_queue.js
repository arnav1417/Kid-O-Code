const Queue = require("bull");

const Job = require("./schema/jobs");
const { executeCpp } = require("./executor/cpp");
const { executePy } = require("./executor/python");

const jobQueue = new Queue("job-runner-queue");
const NUM_WORKERS = 5;

jobQueue.process(NUM_WORKERS, async ({ data }) => {
  const jobId = data.id;
  const job = await Job.findById(jobId);
  if (job === undefined) {
    throw Error(`cannot find Job with id ${jobId}`);
  }
  try {
    let output;
    job["startedAt"] = new Date();
    if (job.language === "cpp") {
      output = await executeCpp(job.filepath);
    } else if (job.language === "py") {
      output = await executePy(job.filepath);
      console.log("1")
      console.log(output);
    }
    job["completedAt"] = new Date();
    job["output"] = output;
    console.log(output);
    job["status"] = "success";
    await job.save();
    return true;
  } catch (err) {
    job["completedAt"] = new Date();
    job["output"] = JSON.stringify(err);
    job["status"] = "error";
    await job.save();
    throw Error(JSON.stringify(err));
  }
});

jobQueue.on("failed", (error) => {
  console.error(error.data.id, error.failedReason);
});

const addJobToQueue = async (jobId) => {
  jobQueue.add({
    id: jobId,
  });
};

module.exports = {
  addJobToQueue,
};
