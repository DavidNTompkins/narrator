const Privacy = () => {

  const privacyText = `
  There is no privacy policy here anymore. Your files and images are kept locally - but are sent to cloud providers in messages and image/video generation. I can't see what you're doing, but presumably some company can. 

  Feel free to ask about it on the discord! 
  
`
  
  return (
    <div className="TOS">
      {privacyText}  
    </div>
    )
}
export default Privacy