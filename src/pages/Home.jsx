
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import Subgroups from '../components/Subgroups/Subgroups';
import Events from '../components/Events/Events';
import Announcements from '../components/Announcements/Announcements';
import Members from '../components/Members/Members';
import Birthdays from '../components/Birthdays/Birthdays';
import Footer from '../components/Footer/Footer';

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Subgroups />
        <Events />
        <Announcements />
        <Members />
        <Birthdays />
        <Footer />
    </>
  );
}

export default Home;
