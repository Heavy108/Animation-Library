import style from "./whatsHappeningCard.module.css";
// import { ClockIcon, LocationIcon } from "@/icons/icon";
import Image from "next/image";

// 1. Define the props the card will accept
export interface WhatsHappeningCardProps {
  imageUrl: string;
  title: string;
  tags: string[]; // Accepts an array of strings so you can pass 1, 2, or more tags
  date: string;
  location: string;
}

function WhatsHappeningCard({
  imageUrl,
  title,
  tags,
  date,
  location,
}: WhatsHappeningCardProps) {
  return (
    <div className={style.EventCard}>
      <div className={style.potrait}>
        <Image
          src={imageUrl}
          height={400}
          width={400}
          alt={`${title} Image`} 
        />
      </div>

      <div className={style.introduction}>
        <h1 className="subtitle-1">{title}</h1>

        {/* 2. Dynamically map through the array of tags */}
        {tags && tags.length > 0 && (
          <div className={style.tags}>
            {tags.map((tag, index) => (
              <p key={index} className="tag-text">
                {tag}
              </p>
            ))}
          </div>
        )}

        <div className={style.info}>
          <div className={style.infodetail}>
            {/* <ClockIcon size={20} /> */}
            <p className="body-4">{date}</p>
          </div>
          <div className={style.infodetail}>
            {/* <LocationIcon size={20} /> */}
            <p className="body-4">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsHappeningCard;
