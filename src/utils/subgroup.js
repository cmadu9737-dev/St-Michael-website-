export function getSubgroup(dateOfBirth) {
  if (!dateOfBirth) return null;

  const month = new Date(`${dateOfBirth}T00:00:00`).getMonth() + 1;

  if (month >= 1 && month <= 4) {
    return {
      name: 'St. John Bosco',
      slug: 'st-john-bosco',
      image: '/src/assets/john.png',
    };
  }

  if (month >= 5 && month <= 8) {
    return {
      name: 'St. Charles Lwanga',
      slug: 'st-charles-lwanga',
      image: '/src/assets/Charles.png',
    };
  }

  return {
    name: 'St. Aloysius Gonzaga',
    slug: 'st-aloysius-gonzaga',
    image: '/src/assets/aloy.png',
  };
}