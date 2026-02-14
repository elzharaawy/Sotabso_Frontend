import AnimationWrapper from "../common/page-animation";

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & Editor-in-Chief",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
      bio: "Passionate about storytelling and creating meaningful content that inspires.",
    },
    {
      name: "Michael Chen",
      role: "Lead Developer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
      bio: "Building seamless digital experiences with clean code and innovative solutions.",
    },
    {
      name: "Emma Williams",
      role: "Content Strategist",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
      bio: "Crafting compelling narratives that connect with audiences worldwide.",
    },
    {
      name: "David Rodriguez",
      role: "Community Manager",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      bio: "Building and nurturing a vibrant community of writers and readers.",
    },
  ];

  const values = [
    {
      icon: "fi-rr-lightbulb",
      title: "Innovation",
      description:
        "We constantly push boundaries to bring fresh perspectives and cutting-edge features to our platform.",
    },
    {
      icon: "fi-rr-users-alt",
      title: "Community",
      description:
        "Building a supportive space where writers and readers can connect, share, and grow together.",
    },
    {
      icon: "fi-rr-shield-check",
      title: "Quality",
      description:
        "We maintain high standards for content, ensuring every piece adds value to our readers.",
    },
    {
      icon: "fi-rr-globe",
      title: "Diversity",
      description:
        "Celebrating diverse voices and perspectives from writers around the world.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Writers" },
    { number: "50K+", label: "Published Articles" },
    { number: "1M+", label: "Monthly Readers" },
    { number: "150+", label: "Countries Reached" },
  ];

  return (
    <AnimationWrapper>
      <section className="h-cover">
        {/* Hero Section */}
        <div className="max-w-[900px] mx-auto text-center mb-20">
          <h1 className="font-gelasio text-4xl md:text-5xl font-bold mb-6">
            About Our Story
          </h1>
          <p className="text-dark-grey text-xl leading-8 mb-8">
            We're building a platform where ideas flourish, stories come alive,
            and communities thrive. Join us in our mission to democratize
            content creation and make quality writing accessible to everyone.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-grey/50 rounded-lg">
              <h3 className="font-bold text-3xl md:text-4xl text-purple mb-2">
                {stat.number}
              </h3>
              <p className="text-dark-grey">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="max-w-[900px] mx-auto mb-20">
          <div className="bg-purple/5 border border-purple/20 rounded-lg p-8 md:p-12">
            <h2 className="font-gelasio text-3xl md:text-4xl font-bold mb-6 text-center">
              Our Mission
            </h2>
            <p className="text-xl leading-8 text-center text-dark-grey mb-6">
              To empower writers worldwide by providing a beautiful, intuitive
              platform where their voices can be heard. We believe that everyone
              has a story worth sharing, and we're here to make that sharing
              effortless.
            </p>
            <p className="text-xl leading-8 text-center text-dark-grey">
              Through innovative technology and a passionate community, we're
              reimagining what a modern blogging platform can be—one that puts
              creators first and celebrates the art of written expression.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="font-gelasio text-3xl md:text-4xl font-bold mb-10 text-center">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 bg-white border border-grey rounded-lg hover:border-purple/30 transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple/10 rounded-full flex items-center justify-center">
                    <i className={`fi ${value.icon} text-purple text-xl`}></i>
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">{value.title}</h3>
                  <p className="text-dark-grey leading-7">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <h2 className="font-gelasio text-3xl md:text-4xl font-bold mb-10 text-center">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-grey border-4 border-grey group-hover:border-purple transition-all">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-purple text-base mb-3">{member.role}</p>
                <p className="text-dark-grey text-sm leading-6">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="max-w-[700px] mx-auto mb-20">
          <h2 className="font-gelasio text-3xl md:text-4xl font-bold mb-10 text-center">
            Our Journey
          </h2>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="font-bold text-purple text-xl">2022</span>
              </div>
              <div className="flex-grow border-l-2 border-grey pl-6 pb-8">
                <h3 className="font-bold text-xl mb-2">The Beginning</h3>
                <p className="text-dark-grey leading-7">
                  Started as a simple idea to create a better writing platform
                  for creators.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="font-bold text-purple text-xl">2023</span>
              </div>
              <div className="flex-grow border-l-2 border-grey pl-6 pb-8">
                <h3 className="font-bold text-xl mb-2">Official Launch</h3>
                <p className="text-dark-grey leading-7">
                  Launched publicly with 100 beta users and received
                  overwhelming positive feedback.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="font-bold text-purple text-xl">2024</span>
              </div>
              <div className="flex-grow border-l-2 border-grey pl-6 pb-8">
                <h3 className="font-bold text-xl mb-2">Rapid Growth</h3>
                <p className="text-dark-grey leading-7">
                  Reached 10,000 active writers and expanded features based on
                  community feedback.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-24 text-right">
                <span className="font-bold text-purple text-xl">2026</span>
              </div>
              <div className="flex-grow pl-6">
                <h3 className="font-bold text-xl mb-2">Today</h3>
                <p className="text-dark-grey leading-7">
                  A thriving community of writers and readers from over 150
                  countries worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-[700px] mx-auto text-center bg-grey/50 rounded-lg p-8 md:p-12">
          <h2 className="font-gelasio text-3xl md:text-4xl font-bold mb-4">
            Join Our Community
          </h2>
          <p className="text-dark-grey text-xl leading-8 mb-8">
            Whether you're a seasoned writer or just starting out, there's a
            place for you here. Start sharing your stories today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="btn-dark">Start Writing</button>
            <button className="btn-light">Learn More</button>
          </div>
        </div>
      </section>
    </AnimationWrapper>
  );
};

export default AboutPage;
