import { Collection } from '@/components/shared/Collection';
import { navLinks } from '@/constants';
import { getUserImages } from '@/lib/actions/image.actions';
import Image from 'next/image';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { getUserById } from '@/lib/actions/user.actions';
import { SignedIn } from '@clerk/nextjs';

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;
  const searchQuery = (searchParams?.query as string) || '';

  const { userId } = auth();

  if (!userId) {
    return <HeaderSection />;
  }

  const user = await getUserById(userId as string);
  const userImage = await getUserImages({
    page,
    limit: 9,
    userId: user._id as string,
    searchQuery,
  });

  return (
    <>
      <HeaderSection />

      <section className="sm:mt-12">
        <SignedIn>
          <Collection
            hasSearch={true}
            images={userImage?.data}
            totalPages={userImage?.totalPages}
            page={page}
          />
        </SignedIn>
      </section>
    </>
  );
};

export default Home;

const HeaderSection = () => {
  return (
    <section className="sm-mobile:flex-center sm-mobile:h-72 flex-col gap-4 rounded-[20px] border bg-banner bg-cover bg-no-repeat px-4 py-8 sm-mobile:p-10 shadow-inner">
      <h1 className=" h1-semibold max-w-[500px] flex-wrap text-center text-white shadow-sm">
        Unleash Your Creative Vision with Imaginify
      </h1>
      <ul className="flex sm-mobile:flex-none sm-mobile:flex-center w-full gap-5 justify-evenly sm-mobile:gap-20 flex-wrap sm-mobile:flex-nowrap sm-mobile:mt-0 mt-5">
        {navLinks.slice(1, 5).map((link) => (
          <Link
            key={link.route}
            href={link.route}
            className="flex-center flex-col gap-2 active:scale-90 duration-150 ease-in-out transition-all">
            <li className="flex-center w-fit rounded-full bg-white p-4">
              <Image src={link.icon} alt="image" width={24} height={24} />
            </li>
            <p className="p-14-medium text-center text-white">{link.label}</p>
          </Link>
        ))}
      </ul>
    </section>
  );
};
