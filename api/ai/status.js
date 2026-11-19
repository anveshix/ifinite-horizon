const {config,listChapters}=require('../../lib/ai');

module.exports=async function status(req,res){
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(req.method!=='GET'){
    res.setHeader('Allow','GET');
    return res.status(405).json({error:'METHOD_NOT_ALLOWED'});
  }
  const ready=config().enabled;
  return res.status(200).json({
    enabled:ready,
    tools:ready?['lesson-plan','worksheet-builder']:[],
    course:ready?{id:'ix',title:'Class IX Science (086) · current and separately labelled historical syllabus tracks',chapters:listChapters()}:null,
    notice:'AI-generated drafts require teacher review. Requests are sent to Google Gemini.'
  });
};
