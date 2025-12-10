"use client";
import { motion } from "framer-motion";
import { Heart, Rocket, Target, Users } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: Users, title: "User-First", desc: "Every feature is designed with the end-user experience in mind" },
    { icon: Target, title: "Simplicity", desc: "Powerful tools that anyone can use, no coding required" },
    { icon: Rocket, title: "Innovation", desc: "Pushing boundaries with 3D avatars and smart analytics" },
    { icon: Heart, title: "Community", desc: "Built by developers, for developers and their users" },
  ];

  const team = [
    { name: "Lisan Al-Gaib", role: "Frontend Engineer", avatar: "LA" },
    { name: "TBNelly", role: "Fronted Engineer", avatar: "TB" },
    { name: "Chindindu Codes", role: "Frontend Engineer", avatar: "CC" },
    { name: "Charlz", role: "Frontend Engineer", avatar: "C" },
    { name: "GIGO", role: "Frontend Engineer", avatar: "GG" },
    { name: "Ibn", role: "Frontend Engineer", avatar: "IBN" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="py-24 bg-linear-to-br from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              About ZenGuide
            </h1>
            <p className="text-lg text-muted-foreground">
               ZenGuide is an onboarding widget that helps you create interactive tours for your websites.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-display font-bold text-foreground text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Our Values
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                className="p-6 rounded-2xl bg-card border border-border/50 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl font-display font-bold text-foreground text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Meet the Team
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-20 h-20 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary-foreground">{member.avatar}</span>
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { num: "10K+", label: "Tours Created" },
              { num: "500+", label: "Happy Teams" },
              { num: "2M+", label: "Users Guided" },
              { num: "98%", label: "Satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-display font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                  {stat.num}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
